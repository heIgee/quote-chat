import { useRef } from 'react';

export default function ChatInput({
  onSubmit,
}: {
  onSubmit: (message: string) => void;
}) {
  const inputEl = useRef<HTMLInputElement>(null);

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!inputEl.current) return;
    onSubmit(inputEl.current.value);
    inputEl.current.value = '';
  };

  return (
    <div className='chat-input'>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputEl}
          type='text'
          name='message'
          placeholder='your message here...'
        />
        <button type='submit'>
          <i className='fas fa-paper-plane'></i>
        </button>
      </form>
    </div>
  );
}
