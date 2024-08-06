import type User from '../../models/User';

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
    <article className='auth-panel'>
      {isChecking ? (
        <small>Checking your status...</small>
      ) : (
        <>
          {user ? (
            <>
              <h4>Welcome, {user.displayName}</h4>
              <button className='button' onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <h4>Please log in to save your chats</h4>
              <button className='button button-primary' onClick={onLogin}>
                Login with Google
              </button>
            </>
          )}
        </>
      )}
    </article>
  );
}
