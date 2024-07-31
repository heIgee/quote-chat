import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  const handleFetch = async () => {
    setCount((c) => c + 1);
    const url = import.meta.env.VITE_SERVER_URL;
    const res = await fetch(`${url}/`);
    console.log(res);
    const data = await res.json();
    console.log(data);
    setMessage(data.message);
  };

  return (
    <>
      <h1>QuoteChat</h1>
      <h2>Express says: {message}</h2>
      <h3>It is {import.meta.env.VITE_SERVER_URL}</h3>
      <div className='card'>
        <button onClick={handleFetch}>Ping {count}</button>
      </div>
      <p className='read-the-docs'>what am I doing here</p>
    </>
  );
}

export default App;

