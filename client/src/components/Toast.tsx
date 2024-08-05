import { useEffect } from 'react';
import './Toast.css';

export default function Toast({
  message,
  botName,
  onClose,
  onClick,
}: {
  message: string;
  botName: string;
  onClose: () => void;
  onClick: () => void;
}) {
  useEffect(() => {
    const timerId = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timerId);
  }, [onClose]);

  return (
    <div className='toast' onClick={onClick}>
      <strong>{botName}</strong>: {message}
    </div>
  );
}
