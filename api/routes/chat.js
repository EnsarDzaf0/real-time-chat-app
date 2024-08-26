const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { accessChat, getChats, createGroup, renameGroup, addUserToGroup, removeUserFromGroup } = require('../controllers/chat');

router.post('/chat', auth, accessChat);
router.get('/chats', auth, getChats);
router.post('/group', auth, createGroup);
router.put('/group', auth, renameGroup);
router.put('/group/add', auth, addUserToGroup);
router.put('/group/remove', auth, removeUserFromGroup);

module.exports = router;