import './ChatList.css';
import type ChatModel from '../../models/Chat';
import ChatPreview from './ChatPreview';

export default function ChatList({
  chats,
  onSelect,
  onDelete,
  onRename,
}: {
  chats: ChatModel[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (chatId: string, botName: string) => void;
}) {
  return (
    <section className='chat-list'>
      <h2 className='chat-list-title'>All your chats</h2>
      {chats.map((c) => (
        <ChatPreview
          key={c._id}
          chat={c}
          onSelect={onSelect}
          onDelete={onDelete}
          onRename={(botName: string) => onRename(c._id, botName)}
        />
      ))}
    </section>
  );
}
