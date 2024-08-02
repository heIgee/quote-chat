import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
  isBot: Boolean,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  messages: [messageSchema],
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
