import { useEffect, useRef } from 'react';
import type MessageModel from '../../models/Message';
import Message from './Message';

export default function MessageList({
  botName,
  isBotTyping,
  messages,
  onEdit,
}: {
  botName: string;
  isBotTyping: boolean;
  messages: MessageModel[];
  onEdit: (messageId: string, content: string) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className='message-list'>
      {messages.map((m) => (
        <Message
          key={m._id}
          message={m}
          onEdit={(content: string) => onEdit(m._id, content)}
        />
      ))}
      {isBotTyping && (
        <Message
          message={{
            _id: '-1',
            isBot: true,
            content: `${botName} is typing...`,
            timestamp: new Date(),
          }}
          onEdit={() => {}}
          excludeTime={true}
        />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
