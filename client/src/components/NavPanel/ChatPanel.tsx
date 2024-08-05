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
    <article>
      <div
        style={{
          width: '100%',
          outline: '1px dashed brown',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 1rem',
        }}
      >
        <input
          type='text'
          placeholder='search chats by name...'
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
        />
        <button onClick={() => setIsCreatingChat((icc) => !icc)}>
          {isCreatingChat ? 'cancel' : 'new chat'}
        </button>
      </div>

      <div
        style={{
          minHeight: '1rem',
          width: '100%',
          outline: '1px dashed brown',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 1rem',
          marginTop: '1rem',
        }}
      >
        {isCreatingChat && (
          <>
            <input
              type='text'
              placeholder='first name'
              value={firstName}
              onChange={(ev) => setFirstName(ev.target.value)}
            />
            <input
              type='text'
              placeholder='last name'
              value={lastName}
              onChange={(ev) => setLastName(ev.target.value)}
            />
            <button onClick={handleCreate}>create</button>
          </>
        )}
      </div>
    </article>
  );
}
