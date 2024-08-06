import { useState } from 'react';
import type MessageModel from '../../models/Message';

export default function Message({
  message,
  onEdit,
  excludeTime = false,
}: {
  message: MessageModel;
  onEdit: (content: string) => void;
  excludeTime?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState(message.content);
  const isBot = message.isBot;

  return (
    <div className={`message ${isBot ? 'message-bot' : 'message-user'}`}>
      {isEditing ? (
        <div className='message-edit'>
          <textarea
            value={newMessageContent}
            onChange={(ev) => setNewMessageContent(ev.target.value)}
          />
          <button
            className='message-edit-button'
            onClick={() => {
              if (newMessageContent !== message.content) {
                onEdit(newMessageContent);
              }
              setIsEditing(false);
            }}
          >
            Confirm
          </button>
        </div>
      ) : (
        <>
          <p className='message-content'>{message.content}</p>
          {!isBot && (
            <button
              className='message-edit-button'
              onClick={() => setIsEditing(true)}
            >
              <i className='fas fa-pencil-alt'></i>
            </button>
          )}
        </>
      )}
      {!excludeTime && (
        <small className='message-timestamp'>
          {message.timestamp.toLocaleString([], {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </small>
      )}
    </div>
  );
}
