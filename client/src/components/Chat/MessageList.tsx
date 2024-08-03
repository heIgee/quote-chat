import type MessageModel from '../../models/Message';
import Message from './Message';

export default function MessageList({
  messages,
}: {
  messages: MessageModel[];
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflow: 'auto',
        justifySelf: 'end',
      }}
    >
      {messages.map((m) => (
        <Message key={m._id} message={m} />
      ))}
    </div>
  );
}
