const bcrypt = require('bcrypt');

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw error;
    }
}

async function comparePasswords(inputPassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    hashPassword,
    comparePasswords
};