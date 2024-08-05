import './NavPanel.css';

export default function NavPanel({ children }: { children: React.ReactNode }) {
  return <section className='nav-panel'>{children}</section>;
}
