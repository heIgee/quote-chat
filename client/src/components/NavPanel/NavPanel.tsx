export default function NavPanel({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        minHeight: '15%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1rem 0',
        gap: '0.6rem',
        outline: '1px dashed pink',
      }}
    >
      {children}
    </section>
  );
}
