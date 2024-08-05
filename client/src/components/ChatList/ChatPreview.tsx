import { useState } from 'react';
import Chat from '../../models/Chat';

export default function ChatPreview({
  chat,
  onSelect,
  onDelete,
  onRename,
}: {
  chat: Chat;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (botName: string) => void;
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newBotName, setNewBotName] = useState(chat.botName);
  const lastMessage = chat.messages.at(-1);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <article className='chat-preview'>
      <div className='chat-preview-content' onClick={() => onSelect(chat._id)}>
        <div className='chat-preview-header'>
          <span className='chat-preview-name'>
            {isRenaming ? (
              <input
                className='chat-preview-rename-input'
                onClick={(ev) => ev.stopPropagation()}
                value={newBotName}
                onChange={(ev) => setNewBotName(ev.target.value)}
              />
            ) : (
              chat.botName
            )}
          </span>
          <span className='chat-preview-date'>
            {lastMessage?.timestamp.toLocaleDateString()}
          </span>
        </div>
        <p className='chat-preview-message'>{lastMessage?.content}</p>
      </div>
      <div className='chat-preview-actions'>
        <button
          className='chat-preview-button'
          onClick={(ev) => {
            ev.stopPropagation();
            if (isRenaming) onRename(newBotName);
            setIsRenaming((ir) => !ir);
          }}
        >
          {isRenaming ? 'Confirm' : <i className='fas fa-pencil-alt'></i>}
        </button>
        {!isDeleting ? (
          <button
            className='chat-preview-button delete'
            onClick={(ev) => {
              ev.stopPropagation();
              setIsDeleting(true);
            }}
          >
            <i className='fas fa-trash-alt'></i>
          </button>
        ) : (
          <div className='chat-preview-delete-confirm'>
            <span>Are you sure?</span>
            <button
              className='chat-preview-button delete'
              onClick={(ev) => {
                ev.stopPropagation();
                onDelete(chat._id);
              }}
            >
              Yes, delete
            </button>
            <button
              className='chat-preview-button'
              onClick={(ev) => {
                ev.stopPropagation();
                setIsDeleting(false);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
