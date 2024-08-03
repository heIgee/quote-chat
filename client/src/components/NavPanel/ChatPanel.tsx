export default function ChatPanel() {
  return (
    <article
      style={{
        outline: '1px dashed brown',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 2rem',
      }}
    >
      <input type='text' placeholder='search in chats...' name='' id='' />
      <button>new chat</button>
    </article>
  );
}
