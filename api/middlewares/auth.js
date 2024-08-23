const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.SECRET_KEY);
        req.user = data;
        next();
    } catch (error) {
        return res.status(401).send({ error: 'Not authorized' });
    }
};

module.exports = auth;