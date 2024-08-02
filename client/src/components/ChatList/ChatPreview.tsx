import Chat from '../../models/Chat';

export default function ChatPreview({
  chat,
  onSelect,
}: {
  chat: Chat;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      style={{ border: '2px solid darkgray', padding: '1rem' }}
      onClick={() => onSelect(chat?._id)}
    >
      <p>{chat.botName}</p>
      <p>{chat.messages.at(-1)?.content}</p>
      <p>{chat.messages.at(-1)?.timestamp.toDateString()}</p>
    </div>
  );
}
