const UserService = require('../services/user');

const login = async (req, res) => {
    try {
        const { user, token } = await UserService.loginUser(req.body);
        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const register = async (req, res) => {
    try {
        const userData = JSON.parse(req.body.userData);
        const user = await UserService.registerUser(userData, req.file);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        let search = '';
        if (req.query.search) search = req.query.search
        const users = await UserService.getAllUsersSearch(search, req.user.id);
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    login,
    register,
    getAllUsers
};	