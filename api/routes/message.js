const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const rateLimiter = require('../middlewares/rateLimiter');
const { sendMessage, allChatMessages } = require('../controllers/message');

router.post('/message', auth, rateLimiter, sendMessage);
router.get('/messages/:chatId', auth, allChatMessages);

module.exports = router;