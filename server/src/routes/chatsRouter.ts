// routes/chats.ts
import express from 'express';
import mongoose from 'mongoose';
import Chat, { IChat } from '../models/Chat.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.get(
  '/',
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    try {
      const chats = await Chat.find({ ownerId: req.user!._id });
      res.json({ chats });
    } catch (error) {
      next(error);
    }
  }),
);

router.put(
  '/',
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    try {
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
  }),
);

router.delete(
  '/:id',
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    try {
      const chatId = req.params.id;
      const userId = req.user!._id;

      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        res.status(400).json({ message: 'Invalid chat ID' });
      }

      const deletedChat = await Chat.findOneAndDelete({
        _id: chatId,
        ownerId: userId,
      });

      if (!deletedChat) {
        res.status(404).json({
          message: 'Chat not found or you do not have permission to delete it',
        });
      }

      res.json({ message: 'Chat deleted successfully', deletedChat });
    } catch (error) {
      next(error);
    }
  }),
);

export default router;
