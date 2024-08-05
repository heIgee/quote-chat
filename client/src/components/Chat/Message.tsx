import { useState } from 'react';
import type MessageModel from '../../models/Message';

export default function Message({
  message,
  onEdit,
}: {
  message: MessageModel;
  onEdit: (content: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState(message.content);
  const isBot = message.isBot;
  return (
    <div
      style={{
        textAlign: isBot ? 'left' : 'right',
        alignSelf: isBot ? 'start' : 'end',
        backgroundColor: isBot ? 'darkcyan' : 'black',
        maxWidth: '20rem',
      }}
    >
      {isEditing ? (
        <div>
          <textarea
            value={newMessageContent}
            onChange={(ev) => setNewMessageContent(ev.target.value)}
          />
        </div>
      ) : (
        <p>{message.content}</p>
      )}

      {!isBot && (
        <button
          onClick={() => {
            if (isEditing) onEdit(newMessageContent);
            setIsEditing((ie) => !ie);
          }}
        >
          {isEditing ? 'confirm' : 'edit'}
        </button>
      )}
      <small>{message.timestamp.toLocaleString()}</small>
    </div>
  );
}
