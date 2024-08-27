const MessageService = require('../services/message');

const sendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;
        const message = await MessageService.sendMessage(chatId, req.user.id, content);
        res.status(200).json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const allChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await MessageService.getAllMessages(chatId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    sendMessage,
    allChatMessages
};