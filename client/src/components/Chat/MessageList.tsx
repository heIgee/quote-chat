import type MessageModel from '../../models/Message';
import Message from './Message';

export default function MessageList({
  messages,
}: {
  messages: MessageModel[];
}) {
  return (
    <>
      {messages.map((m) => (
        <Message key={m._id} message={m} />
      ))}
    </>
  );
}
