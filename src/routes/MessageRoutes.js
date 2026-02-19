import express from 'express';
import Messages from '../models/Message.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/send', authMiddleware, async (req, res) => {
    const { senderId, receiverId, content } = req.body;
    try {
        const message = await Messages.sendMessage(senderId, receiverId, content);
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get messages between two users
router.get('/conversations/:userId1/:userId2', authMiddleware, async (req, res) => {
    const { userId1, userId2 } = req.params;
    try {
        const conversation = await Messages.getConversation(userId1, userId2);
        res.status(200).json(conversation);
    } catch (error) {        res.status(500).json({ error: error.message });
    }
});

export default router;