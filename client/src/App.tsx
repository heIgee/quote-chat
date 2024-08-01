import { useEffect, useRef, useState } from 'react';
import './App.css';
// import { useFetch } from './hooks/useFetch';
import type Quote from './models/Quote';

function App() {
  const [count, setCount] = useState(0);
  // const [message, setMessage] = useState('');

  const [messages, setMessages] = useState<string[]>([]);

  const inputEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const handleFetch = async () => {
    setCount((c) => c + 1);
    const url = import.meta.env.VITE_SERVER_URL;
    const res = await fetch(`${url}/quote3sec`);
    const data: { quote: Quote } = await res.json();
    data && setMessages((prev) => [...prev, data.quote.content]);
  };

  const handleSend = (message: string) => {
    if (!message) return;
    setMessages((prev) => [...prev, message]);
    inputEl.current && (inputEl.current.value &&= '');
  };

  // const isString = (value: unknown): value is string => {
  //   return typeof value === 'string';
  // };

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const message = inputEl.current?.value;
    if (!message) return;

    handleSend(message);
    handleFetch();

    // const formData = new FormData(ev.currentTarget);
    // const data = Object.fromEntries(formData);
    // if (isString(data.message)) {
    //   handleSend(data.message);
    // }
  };

  return (
    <>
      <h1>QuoteChat</h1>
      <form onSubmit={handleSubmit}>
        <input ref={inputEl} type='text' name='message' />
        <button type='submit'>send</button>
      </form>

      {messages.map((m, idx) => (
        <p key={idx}>{m}</p>
      ))}

      <div className='card'>
        <button onClick={handleFetch}>Ping {count}</button>
      </div>
      <p className='read-the-docs'>It is {import.meta.env.VITE_SERVER_URL}</p>
    </>
  );
}

export default App;
