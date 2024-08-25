const { DataTypes, Model } = require('sequelize');

class Message extends Model {
    static associate(models) {
        Message.belongsTo(models.User, {
            foreignKey: 'senderId',
            as: 'sender'
        });
        Message.belongsTo(models.Chat, {
            foreignKey: 'chatId',
            as: 'chat'
        });
    }
}

module.exports = (sequelize) => {
    Message.init({
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
        senderId: {
            field: 'sender_id',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            field: 'created_at',
            type: 'TIMESTAMP',
            allowNull: false
        },
        updatedAt: {
            field: 'updated_at',
            type: 'TIMESTAMP',
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Message',
        tableName: 'messages',
        timestamps: true
    })
    return Message;
};