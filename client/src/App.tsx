import { useCallback, useEffect, useMemo, useState } from 'react';
import ChatList from './components/ChatList';
import Chat from './components/Chat';
import MessageList from './components/Chat/MessageList';
import ChatInput from './components/Chat/ChatInput';
import ChatHead from './components/Chat/ChatHead';
import type ChatModel from './models/Chat';
import type MessageModel from './models/Message';
import type Quote from './models/Quote';
import type User from './models/User';
import { initChats } from './initData';
import NavPanel from './components/NavPanel/NavPanel';
import AuthPanel from './components/NavPanel/AuthPanel';
import ChatPanel from './components/NavPanel/ChatPanel';
import './App.css';
import { generateObjectId } from './utils/generateObjectId';

const url = import.meta.env.VITE_SERVER_URL;

console.log(initChats);

// check auth status
// logged in  - do NOT save chats, fetch first, find out if there are any
// logged out - do NOT call anything

function App() {
  const [chats, setChats] = useState<ChatModel[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const currentChat = useMemo(() => {
    return chats.find((c) => c._id === currentChatId);
  }, [chats, currentChatId]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.botName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
  );

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const remoteSaveChats = useCallback(async (chatsToSave: ChatModel[]) => {
    try {
      await fetch(`${url}/chats`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chats: chatsToSave }),
      });
    } catch (error) {
      console.error('Error saving chats:', error);
    }
  }, []);

  const fetchChats = useCallback(async () => {
    try {
      const response = await fetch(`${url}/chats`, {
        credentials: 'include',
      });

      const data: { chats: ChatModel[] } = await response.json();

      if (data.chats.length > 0) {
        const fixedChats = data.chats.map((chat) => ({
          ...chat,
          messages: chat.messages.map((message) => ({
            ...message,
            timestamp: new Date(message.timestamp),
          })),
        }));
        setChats(fixedChats);
      } else {
        // If no chats, use initChats and save them
        setChats(initChats);
        await remoteSaveChats(initChats);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }, [remoteSaveChats]);

  useEffect(() => {
    if (user) {
      fetchChats();
    } else {
      setChats(initChats);
    }
  }, [user, fetchChats]);

  // useEffect(() => {
  //   if (user && toSaveChats.current) {
  //     saveChats();
  //   }
  // }, [chats, user, saveChats]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${url}/auth/status`, {
        credentials: 'include',
      });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const appendMessage = (message: MessageModel) => {
    if (!currentChatId) return;
    setChats((prev) => {
      const newChats = prev.map((chat) =>
        chat._id === currentChatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat,
      );
      remoteSaveChats(newChats);
      return newChats;
    });
  };

  const fetchQuote = async () => {
    const res = await fetch(`${url}/quote/in3sec`);
    const data: { quote: Quote } = await res.json();
    const message: MessageModel = {
      _id: generateObjectId(),
      isBot: true,
      content: data.quote.content,
      timestamp: new Date(),
    };
    appendMessage(message);
    // TOOD toast notification if message is not from selected chat
  };

  const handleSend = (messageStr: string) => {
    if (!messageStr) return;
    const message: MessageModel = {
      _id: generateObjectId(),
      isBot: false,
      content: messageStr,
      timestamp: new Date(),
    };
    appendMessage(message);
    fetchQuote();
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(() => chatId);
  };

  const remoteDeleteChat = async (chatId: string) => {
    try {
      await fetch(`${url}/chats/${chatId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => {
      const newChats = prev.filter((chat) => chat._id !== chatId);
      remoteDeleteChat(chatId);
      return newChats;
    });
  };

  const handleCreateChat = (botName: string) => {
    if (!user || !botName) return;
    const newChat: ChatModel = {
      _id: generateObjectId(),
      ownerId: user._id,
      botName: botName,
      messages: [],
    };
    setChats((prev) => {
      const newChats = [...prev, newChat];
      remoteSaveChats(newChats);
      return newChats;
    });
  };

  const handleBotRename = (chatId: string, newBotName: string) => {
    if (!chats.some((c) => c._id === chatId)) return;
    setChats((prev) => {
      const newChats = prev.map((chat) =>
        chat._id === chatId ? { ...chat, botName: newBotName } : chat,
      );
      remoteSaveChats(newChats);
      return newChats;
    });
  };

  const handleMessageEdit = (
    chatId: string,
    messageId: string,
    newContent: string,
  ) => {
    if (!chats.some((c) => c._id === chatId)) return;
    setChats((prev) => {
      const newChats = prev.map((chat) =>
        chat._id === chatId
          ? {
              ...chat,
              messages: chat.messages.map((message) =>
                message._id === messageId
                  ? { ...message, content: newContent }
                  : message,
              ),
            }
          : chat,
      );
      remoteSaveChats(newChats);
      return newChats;
    });
  };

  const handleLogin = () => {
    window.location.href = `${url}/auth/google`;
  };

  const handleLogout = async () => {
    try {
      await fetch(`${url}/auth/logout`, {
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <main className='main'>
        <aside
          style={{
            width: '30vw',
            maxHeight: '100%',
            overflow: 'auto',
            outline: '1px dashed magenta',
          }}
        >
          <NavPanel>
            <AuthPanel
              user={user}
              isChecking={isChecking}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
            <ChatPanel
              query={searchTerm}
              setQuery={(q: string) => setSearchTerm(q)}
              onCreate={(botName: string) => handleCreateChat(botName)}
            />
          </NavPanel>
          <ChatList
            chats={filteredChats}
            onSelect={(id: string) => handleSelectChat(id)}
            onDelete={(id: string) => handleDeleteChat(id)}
            onRename={(chatId: string, botName: string) =>
              handleBotRename(chatId, botName)
            }
          />
        </aside>
        <section
          style={{
            width: '40vw',
            maxHeight: '100%',
            overflow: 'auto',
            outline: '1px dashed limegreen',
          }}
        >
          {currentChat ? (
            <Chat>
              <ChatHead botName={currentChat.botName} />
              <MessageList
                messages={currentChat.messages}
                onEdit={(messageId: string, newContent: string) =>
                  handleMessageEdit(currentChat._id, messageId, newContent)
                }
              />
              <ChatInput onSubmit={handleSend} />
            </Chat>
          ) : (
            <p
              style={{ color: 'grey', textAlign: 'center', marginTop: '2rem' }}
            >
              please select one of the chats
            </p>
          )}
        </section>
      </main>

      <aside>
        <p style={{ color: 'grey', textAlign: 'center', marginTop: '0rem' }}>
          It is {import.meta.env.VITE_SERVER_URL}
        </p>
      </aside>
    </>
  );
}

export default App;
