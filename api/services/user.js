const { User } = require('../models/index');
const { hashPassword, comparePasswords } = require('../utils/password');
const jwt = require('jsonwebtoken');
const tokenExpiration = process.env.TOKEN_EXPIRATION || '1d';
const { loginSchema, registerUserSchema } = require('../validations/user');
const redisClient = require('../redis');
const { Op } = require('sequelize');

class UserService {
    static async getUserByUsername(username) {
        return User.findOne({
            where: {
                username
            },
        });
    }

    static async loginUser(userData) {
        const { error } = loginSchema.validate(userData);
        if (error) {
            throw new Error(error.message);
        }

        const user = await this.getUserByUsername(userData.username);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await comparePasswords(userData.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: tokenExpiration });
        await User.update({ lastLoginDate: new Date() }, {
            where: {
                id: user.id
            }
        });
        await redisClient.sadd('loggedUsers', user.id);
        return { user, token };
    }

    static async registerUser(userData, file) {
        const { error } = registerUserSchema.validate(userData);
        if (error) {
            throw new Error(error.message);
        }
        const user = await this.getUserByUsername(userData.username);
        if (user) {
            throw new Error('Username already exists');
        }
        const hashedPassword = await hashPassword(userData.password);
        const newUser = await User.create({
            ...userData,
            password: hashedPassword,
            image: file ? file.location : null,
            lastLoginDate: new Date()
        });
        const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY, { expiresIn: tokenExpiration });
        await redisClient.sadd('loggedUsers', user.id);
        return { user: newUser, token };
    }

    static async getAllUsersSearch(search, userId) {
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    {
                        username: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        name: {
                            [Op.like]: `%${search}%`
                        }
                    }
                ],
                id: {
                    [Op.ne]: userId
                }
            },
            attributes: {
                exclude: ['password']
            },
        })
        const loggedUsers = await redisClient.smembers('loggedUsers');

        const usersStatus = users.map((user) => {
            const logged = loggedUsers.includes(user.id.toString());
            return {
                ...user.toJSON(),
                logged
            };
        });
        return usersStatus;
    }

    static async logoutUser(user) {
        await redisClient.srem('loggedUsers', user.id);
    }
}

module.exports = UserService;