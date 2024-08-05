import './Chat.css';

export default function Chat({ children }: { children: React.ReactNode }) {
  return <section className='chat-container'>{children}</section>;
}
