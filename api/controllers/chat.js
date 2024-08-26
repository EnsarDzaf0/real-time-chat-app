const ChatService = require('../services/chat');

const accessChat = async (req, res) => {
    const { userId } = req.body;
    try {
        const chat = await ChatService.accessChat(req.user.id, userId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        return res.status(200).json(chat);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getChats = async (req, res) => {
    try {
        const chats = await ChatService.getChats(req.user.id);
        return res.status(200).json(chats);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createGroup = async (req, res) => {
    const { users, name } = req.body;
    try {
        const chat = await ChatService.createGroup(users, name, req.user.id);
        return res.status(201).json(chat);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const renameGroup = async (req, res) => {
    const { chatId, name } = req.body;
    try {
        const chat = await ChatService.renameGroup(chatId, name, req.user.id);
        return res.status(200).json(chat);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const addUserToGroup = async (req, res) => {
    const { chatId, userId } = req.body;
    try {
        const chat = await ChatService.addUserToGroup(chatId, userId, req.user.id);
        return res.status(200).json(chat);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const removeUserFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;
    try {
        const chat = await ChatService.removeUserFromGroup(chatId, userId, req.user.id);
        return res.status(200).json(chat);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    accessChat,
    getChats,
    createGroup,
    renameGroup,
    addUserToGroup,
    removeUserFromGroup
};