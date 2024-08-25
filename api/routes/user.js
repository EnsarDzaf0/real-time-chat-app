const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../config/spaces');
const { login, register, getAllUsers } = require('../controllers/user');

router.post('/login', login);
router.post('/register', upload.single('image'), register);
router.get('/users', auth, getAllUsers);

router.get('/protected', auth, (req, res) => {
    return res.status(200).json({ message: 'You are authorized' });
});

module.exports = router;