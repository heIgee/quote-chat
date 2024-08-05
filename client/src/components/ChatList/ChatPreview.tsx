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
    <article
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10%',
        border: '2px solid darkgray',
        padding: '0 0.8rem',
      }}
      onClick={() => onSelect(chat._id)}
    >
      <div
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <p
          style={{
            margin: '0.6rem 0',
            overflow: 'hidden',
            // textOverflow: 'ellipsis',
            whiteSpace: 'wrap',
            maxWidth: '100%',
          }}
        >
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              if (isRenaming) onRename(newBotName);
              setIsRenaming((ir) => !ir);
            }}
          >
            {isRenaming ? 'confirm' : 'edit'}
          </button>{' '}
          {isRenaming ? (
            <input
              onClick={(ev) => ev.stopPropagation()}
              value={newBotName}
              onChange={(ev) => setNewBotName(ev.target.value)}
            />
          ) : (
            chat.botName
          )}
        </p>
        <p
          style={{
            margin: '0.6rem 0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}
        >
          {lastMessage?.content}
        </p>
      </div>
      <div>
        <p>{lastMessage?.timestamp.toLocaleDateString()}</p>
        <button
          style={{ marginTop: 'auto' }}
          onClick={(ev) => {
            ev.stopPropagation();
            setIsDeleting((id) => !id);
          }}
        >
          {isDeleting ? 'cancel' : 'delete'}
        </button>
        {isDeleting && (
          <div>
            <small>are you sure?</small>
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                onDelete(chat._id);
              }}
            >
              delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
