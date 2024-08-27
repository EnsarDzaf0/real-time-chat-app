const { User, Chat, Message, ChatUser } = require('../models/index');
const { Op, sequelize } = require('sequelize');

class ChatService {

    static async getChatById(chatId) {
        const fullChat = await Chat.findByPk(chatId, {
            include: [
                {
                    model: User,
                    as: 'users',
                    attributes: {
                        exclude: ['password']
                    },
                    through: {
                        attributes: []
                    }
                },
                {
                    model: Message,
                    as: 'latestMessage',
                    include: {
                        model: User,
                        as: 'sender',
                        attributes: ['id', 'username', 'image']
                    }
                }
            ]
        });

        return fullChat;
    }

    static async accessChat(currentUserId, userId) {
        const isChat = await Chat.findOne({
            where: {
                isGroupChat: false
            },
            include: [
                {
                    model: User,
                    as: 'users',
                    through: {
                        attributes: []
                    },
                    where: {
                        id: {
                            [Op.in]: [currentUserId, userId]
                        }
                    }
                }
            ],
            group: ['Chat.id'],
        });

        if (isChat) {
            return await this.getChatById(isChat.id);
        } else {
            const newChat = await Chat.create({
                chatName: 'Chat',
                isGroupChat: false,
            });

            await newChat.addUser(currentUserId);
            await newChat.addUser(userId);

            const fullChat = await this.getChatById(newChat.id);

            return fullChat;
        }
    }

    static async getChats(userId) {
        const userChats = await ChatUser.findAll({
            where: {
                userId
            }
        });
        const chatIds = userChats.map(chat => chat.chatId);
        const chats = await Chat.findAll({
            where: {
                id: {
                    [Op.in]: chatIds
                }
            },
            include: [
                {
                    model: User,
                    as: 'users',
                    attributes: ['id', 'username', 'image'],
                    through: {
                        attributes: []
                    },
                    where: {
                        id: {
                            [Op.ne]: userId
                        }
                    },
                    required: false
                },
                {
                    model: User,
                    as: 'groupAdmin',
                    attributes: ['id', 'username', 'image']
                },
                {
                    model: Message,
                    as: 'latestMessage',
                    include: {
                        model: User,
                        as: 'sender',
                        attributes: ['id', 'username', 'image']
                    }
                }
            ],
            order: [
                ['updatedAt', 'DESC']
            ]
        })
        return chats;
    }

    static async createGroup(users, name, admin) {
        if (!name) {
            throw new Error('Group name is required');
        }
        if (users.length < 2) {
            throw new Error('Group must have at least 3 users');
        }
        const groupExists = await Chat.findOne({
            where: {
                chatName: name,
                isGroupChat: true
            }
        });
        if (groupExists) {
            throw new Error('Group already exists');
        }

        users.push(admin);

        const newGroup = await Chat.create({
            chatName: name,
            isGroupChat: true,
            groupAdminId: admin
        });

        await newGroup.addUsers(users);

        const fullGroup = await Chat.findByPk(newGroup.id, {
            include: [
                {
                    model: User,
                    as: 'users',
                    attributes: ['id', 'username', 'image']
                },
                {
                    model: User,
                    as: 'groupAdmin',
                    attributes: ['id', 'username', 'image']
                }
            ]
        });
        return fullGroup;
    }

    static async renameGroup(chatId, name, userId) {
        const groupExists = await Chat.findOne({
            where: {
                id: chatId,
                isGroupChat: true
            }
        });
        if (!groupExists) {
            throw new Error('Group not found');
        }
        if (groupExists.groupAdminId !== userId) {
            throw new Error('You are not the admin of this group');
        }
        const nameExists = await Chat.findOne({
            where: {
                chatName: name,
                isGroupChat: true
            }
        });
        if (nameExists) {
            throw new Error('Group name already exists');
        }
        await Chat.update({ chatName: name }, {
            where: {
                id: chatId
            }
        });
        const updatedGroup = await Chat.findByPk(chatId, {
            include: [
                {
                    model: User,
                    as: 'users',
                    attributes: ['id', 'username', 'image']
                },
                {
                    model: User,
                    as: 'groupAdmin',
                    attributes: ['id', 'username', 'image']
                }
            ]
        });
        return updatedGroup;
    }

    static async addUserToGroup(chatId, userId, adminId) {
        const groupExists = await Chat.findOne({
            where: {
                id: chatId,
                isGroupChat: true
            }
        });
        if (!groupExists) {
            throw new Error('Group not found');
        }
        if (groupExists.groupAdminId !== adminId) {
            throw new Error('You are not the admin of this group');
        }
        const userExists = await ChatUser.findOne({
            where: {
                chatId,
                userId
            }
        });
        if (userExists) {
            throw new Error('User already in group');
        }
        await groupExists.addUser(userId);
        const updatedGroup = await Chat.findByPk(chatId, {
            include: [
                {
                    model: User,
                    as: 'users',
                    attributes: ['id', 'username', 'image']
                },
                {
                    model: User,
                    as: 'groupAdmin',
                    attributes: ['id', 'username', 'image']
                }
            ]
        });
        return updatedGroup;
    }

    static async removeUserFromGroup(chatId, userId, adminId) {
        const groupExists = await Chat.findOne({
            where: {
                id: chatId,
                isGroupChat: true
            }
        });
        if (!groupExists) {
            throw new Error('Group not found');
        }
        if (groupExists.groupAdminId !== adminId) {
            throw new Error('You are not the admin of this group');
        }
        const userExists = await ChatUser.findOne({
            where: {
                chatId,
                userId
            }
        });
        if (!userExists) {
            throw new Error('User not in group');
        }
        await ChatUser.destroy({
            where: {
                chatId,
                userId
            }
        });
        const updatedGroup = await Chat.findByPk(chatId, {
            include: [
                {
                    model: User,
                    as: 'users',
                    attributes: ['id', 'username', 'image']
                },
                {
                    model: User,
                    as: 'groupAdmin',
                    attributes: ['id', 'username', 'image']
                }
            ]
        });
        return updatedGroup;
    }

    static async updateLastMessage(chatId, messageId) {
        await Chat.update({ latestMessageId: messageId }, {
            where: {
                id: chatId
            }
        });
    }
}

module.exports = ChatService;