import type MessageModel from '../../models/Message';

export default function Message({ message }: { message: MessageModel }) {
  const isBot = message.isBot;
  return (
    <div
      style={{
        textAlign: isBot ? 'left' : 'right',
        backgroundColor: isBot ? 'darkcyan' : 'black',
        maxWidth: '20rem',
      }}
    >
      <p>{message.content}</p>
      <small>{message.timestamp.toLocaleString()}</small>
    </div>
  );
}
