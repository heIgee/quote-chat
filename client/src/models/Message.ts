export default interface Message {
  _id: string;
  isBot: boolean;
  content: string;
  timestamp: Date;
}
