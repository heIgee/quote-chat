export default function Chat({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'end',
        gap: '1rem',
      }}
    >
      {children}
    </section>
  );
}
