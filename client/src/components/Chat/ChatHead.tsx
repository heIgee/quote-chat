export default function ChatHead({ botName }: { botName: string }) {
  return (
    <div className='chat-head'>
      <p>🧑‍🦳 {botName}</p>
    </div>
  );
}
