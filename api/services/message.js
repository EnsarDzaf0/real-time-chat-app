const { User, Chat, Message } = require('../models/index');
const ChatService = require('../services/chat');

class MessageService {
    static async createMessage(chatId, senderId, content) {
        const newMessage = await Message.create({
            chatId,
            senderId,
            content
        });
        return newMessage;
    }

    static async getMessageById(messageId) {
        return Message.findByPk(messageId, {
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'username', 'image', 'email', 'dateOfBirth']
                },
                {
                    model: Chat,
                    as: 'chat',
                    include: {
                        model: User,
                        as: 'users',
                        attributes: ['id', 'username', 'image', 'email', 'dateOfBirth']
                    }
                }
            ]
        });
    }

    static async sendMessage(chatId, senderId, content) {
        const newMessage = await this.createMessage(chatId, senderId, content);
        const message = await this.getMessageById(newMessage.id);
        await ChatService.updateLastMessage(chatId, newMessage.id);
        return message;
    }

    static async getAllMessages(chatId) {
        const messages = await Message.findAll({
            where: {
                chatId
            },
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'username', 'image', 'email', 'dateOfBirth']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        return messages;
    }
}

module.exports = MessageService;