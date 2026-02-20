import express from 'express';
import Messages from '../models/Message.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/send', authMiddleware, async (req, res) => {
    const { receiverId, content } = req.body;
    try {
        const message =  new Messages({
            sender: req.user._id, 
            receiver: receiverId,
             content 
        });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get messages between two users
router.get('/conversations/', authMiddleware, async (req, res) => {
    const { userId1, userId2 } = req.query;
    try {
        const messages = await Messages.find({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 }
            ]
        })
        .populate('sender', 'name')   // populate sender name
        .populate('receiver', 'name') // populate receiver name
        .sort({ createdAt: 1 });      // sort by time

        res.status(200).json(messages);
       
    } catch (error) { res.status(500).json({ error: error.message });
    }
});

export default router;