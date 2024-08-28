const redisClient = require('../redis');

const rateLimiter = (req, res, next) => {
    const userId = req.user.id;

    const redisKey = `ratelimiter:${userId}`;

    redisClient.get(redisKey, (err, count) => {
        if (err) {
            console.error('Redis error:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        const limit = 50;

        if (count && parseInt(count, 10) >= limit) {
            const retryAfter = 30;

            res.status(429).json({
                message: `You have reached the limit of 50 messages per minute. Wait for ${retryAfter} seconds.`,
                retryAfter,
            });
        } else {
            redisClient
                .multi()
                .incr(redisKey)
                .expire(redisKey, 60)
                .exec((incrErr) => {
                    if (incrErr) {
                        console.error('Redis error:', incrErr);
                        res.status(500).json({ message: 'Internal server error' });
                        return;
                    }
                    next();
                });
        }
    });
};
module.exports = rateLimiter;
