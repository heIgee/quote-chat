// routes/chats.ts
import express from 'express';
import mongoose from 'mongoose';
import Chat, { IChat } from '../models/Chat.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.get('/', isAuthenticated, async (req, res, next) => {
  try {
    const chats = await Chat.find({ ownerId: req.user!._id });
    res.json({ chats });
  } catch (error) {
    next(error);
  }
});

router.put('/', isAuthenticated, async (req, res, next) => {
  try {
    console.log(`Put chats from:`, req.user);

    const { chats } = req.body as { chats: IChat[] };
    const userId = req.user!._id;

    const updatedChats = await Promise.all(
      chats.map(async (chat) => {
        if (mongoose.Types.ObjectId.isValid(chat._id)) {
          return await Chat.findOneAndUpdate(
            { _id: chat._id, ownerId: userId },
            {
              botName: chat.botName,
              messages: chat.messages,
              ownerId: userId,
            },
            { new: true, upsert: true },
          );
        } else {
          const newChat = new Chat({
            botName: chat.botName,
            messages: chat.messages,
            ownerId: userId,
          });
          return await newChat.save();
        }
      }),
    );

    res.json({ chats: updatedChats });
  } catch (error) {
    next(error);
  }
});

export default router;
