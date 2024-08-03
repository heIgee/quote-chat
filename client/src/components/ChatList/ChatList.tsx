import ChatModel from '../../models/Chat';
import ChatPreview from './ChatPreview';

export default function ChatList({
  chats,
  onSelect,
}: {
  chats: ChatModel[];
  onSelect: (id: string) => void;
}) {
  return (
    <section style={{ outline: '1px dashed yellow' }}>
      <p>All your chats</p>
      {chats.map((c) => (
        <ChatPreview key={c._id} chat={c} onSelect={onSelect} />
      ))}
    </section>
  );
}
