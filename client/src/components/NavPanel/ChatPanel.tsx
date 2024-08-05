import { useState } from 'react';

export default function ChatPanel({
  query,
  setQuery,
  onCreate,
}: {
  query: string;
  setQuery: (q: string) => void;
  onCreate: (botName: string) => void;
}) {
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleCreate = () => {
    if (!firstName || !lastName) return;
    onCreate(`${firstName} ${lastName}`);
    setFirstName('');
    setLastName('');
  };

  return (
    <article className='chat-panel'>
      <div className='chat-panel-row'>
        <input
          className='input-field'
          type='text'
          placeholder='Search chats by name...'
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
        />
        <button
          className='button'
          onClick={() => setIsCreatingChat((icc) => !icc)}
        >
          {isCreatingChat ? 'Cancel' : 'New Chat'}
        </button>
      </div>

      {isCreatingChat && (
        <div className='chat-panel-row'>
          <div className='create-chat-form'>
            <input
              className='input-field'
              type='text'
              placeholder='First name'
              value={firstName}
              onChange={(ev) => setFirstName(ev.target.value)}
            />
            <input
              className='input-field'
              type='text'
              placeholder='Last name'
              value={lastName}
              onChange={(ev) => setLastName(ev.target.value)}
            />
            <button className='button button-primary' onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
