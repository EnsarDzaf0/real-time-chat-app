const { DataTypes, Model } = require('sequelize');

class ChatUser extends Model {
    static associate(models) {
        ChatUser.belongsTo(models.Chat, {
            foreignKey: 'chatId',
            as: 'chat'
        });
        ChatUser.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    }
}

module.exports = (sequelize) => {
    ChatUser.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        chatId: {
            field: 'chat_id',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            field: 'user_id',
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ChatUser',
        tableName: 'chats_users',
        timestamps: false
    })
    return ChatUser;
};