const { DataTypes, Model } = require('sequelize');

class Chat extends Model {
    static associate(models) {
        Chat.belongsTo(models.User, {
            foreignKey: 'groupAdminId',
            as: 'groupAdmin'
        });
        Chat.belongsToMany(models.User, {
            through: models.ChatUser,
            foreignKey: 'chatId',
            as: 'users'
        });
        Chat.hasMany(models.Message, {
            foreignKey: 'chatId',
            as: 'messages'
        });
    }
}

module.exports = (sequelize) => {
    Chat.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        chatName: {
            field: 'chat_name',
            type: DataTypes.STRING,
            allowNull: false
        },
        isGroupChat: {
            field: 'is_group_chat',
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        groupAdminId: {
            field: 'group_admin_id',
            type: DataTypes.INTEGER,
            allowNull: true
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
        modelName: 'Chat',
        tableName: 'chats',
        timestamps: true
    })
    return Chat;
};