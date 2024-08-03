import Chat from '../../models/Chat';

export default function ChatPreview({
  chat,
  onSelect,
}: {
  chat: Chat;
  onSelect: (id: string) => void;
}) {
  const lastMessage = chat.messages.at(-1);
  return (
    <article
      style={{ border: '2px solid darkgray', padding: '0.2rem' }}
      onClick={() => onSelect(chat._id)}
    >
      <p>{chat.botName}</p>
      {lastMessage ? (
        <>
          <p>{lastMessage.content}</p>
          <p>{lastMessage?.timestamp.toLocaleDateString()}</p>
        </>
      ) : (
        ''
      )}
    </article>
  );
}
