import { useEffect, useRef } from 'react';
import type MessageModel from '../../models/Message';
import Message from './Message';

export default function MessageList({
  messages,
  onEdit,
}: {
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
      <div ref={messagesEndRef} />
    </div>
  );
}
