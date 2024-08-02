import Message from './Message';

export default interface Chat {
  _id: string;
  ownerId: string | null;
  botName: string;
  messages: Message[];
}
