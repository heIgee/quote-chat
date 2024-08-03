import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
  isBot: Boolean,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  botName: String,
  messages: [messageSchema],
});

export interface IChat extends Document {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  botName: string;
  messages: Array<{
    isBot: boolean;
    content: string;
    timestamp: Date;
  }>;
}

const Chat = mongoose.model<IChat>('Chat', chatSchema);

export default Chat;
