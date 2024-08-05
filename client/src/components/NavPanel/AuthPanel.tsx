import User from '../../models/User';

export default function AuthPanel({
  user,
  isChecking,
  onLogin,
  onLogout,
}: {
  user: User | null;
  isChecking: boolean;
  onLogin: () => void;
  onLogout: () => void;
}) {
  return (
    <article
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 2rem',
      }}
    >
      {isChecking ? (
        <small>Checking your status...</small>
      ) : (
        <>
          {user ? (
            <>
              <h4 style={{ display: 'inline-block', margin: 0 }}>
                Welcome, {user.displayName}
              </h4>
              <button onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <h4 style={{ display: 'inline-block', margin: 0 }}>
                Please log in to save your chats
              </h4>
              <button onClick={onLogin}>Login with Google</button>
            </>
          )}
        </>
      )}
    </article>
  );
}
