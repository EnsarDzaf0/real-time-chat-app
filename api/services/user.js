const { User } = require('../models/index');
const { hashPassword, comparePasswords } = require('../utils/password');
const jwt = require('jsonwebtoken');
const tokenExpiration = process.env.TOKEN_EXPIRATION || '30min';
const { loginSchema, registerUserSchema } = require('../validations/user');

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
        return { user: newUser, token };
    }
}

module.exports = UserService;