import { useEffect, useMemo, useState } from 'react';
import type Quote from './models/Quote';
import AuthTest from './AuthTest';
import ChatList from './components/ChatList';
import Chat from './components/Chat';
import MessageList from './components/Chat/MessageList';
import ChatInput from './components/Chat/ChatInput';
import Header from './components/Chat/Header';
import type ChatModel from './models/Chat';
import type MessageModel from './models/Message';
import { initChats } from './initData';
import './App.css';

function App() {
  const [chats, setChats] = useState<ChatModel[]>(initChats);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const currentChat = useMemo(() => {
    return chats.find((c) => c._id === currentChatId);
  }, [chats, currentChatId]);

  useEffect(() => {
    console.log(currentChatId);
  }, [currentChatId]);

  const appendMessage = (message: MessageModel) => {
    if (!currentChatId) return;
    setChats((prev) =>
      prev.map((chat) =>
        chat._id === currentChatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat,
      ),
    );
  };

  const fetchQuote = async () => {
    const url = import.meta.env.VITE_SERVER_URL;
    const res = await fetch(`${url}/quote3sec`);
    const data: { quote: Quote } = await res.json();
    const message: MessageModel = {
      isBot: true,
      content: data.quote.content,
      timestamp: new Date(),
    };
    appendMessage(message);
  };

  const handleSend = (messageStr: string) => {
    if (!messageStr) return;
    const message: MessageModel = {
      isBot: false,
      content: messageStr,
      timestamp: new Date(),
    };
    appendMessage(message);
    fetchQuote();
  };

  // const isString = (value: unknown): value is string => {
  //   return typeof value === 'string';
  // };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(() => id);
  };

  return (
    <>
      <main style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ width: '40rem' }}>
          <ChatList
            chats={chats}
            onSelect={(id: string) => handleSelectChat(id)}
          />
        </div>
        <div style={{ width: '20rem' }}>
          {currentChat ? (
            <Chat>
              <Header botName={currentChat.botName} />
              <MessageList messages={currentChat.messages} />
              <ChatInput onSubmit={handleSend} />
            </Chat>
          ) : (
            <p>please select one of the chats</p>
          )}
        </div>
      </main>

      <AuthTest />

      <p className='read-the-docs'>It is {import.meta.env.VITE_SERVER_URL}</p>
    </>
  );
}

export default App;
