import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ChatList from './components/ChatList';
import Chat from './components/Chat';
import MessageList from './components/Chat/MessageList';
import ChatInput from './components/Chat/ChatInput';
import ChatHead from './components/Chat/ChatHead';
import NavPanel from './components/NavPanel';
import AuthPanel from './components/NavPanel/AuthPanel';
import OptionsPanel from './components/NavPanel/OptionsPanel';
import ThemeToggle from './components/NavPanel/ThemeToggle';
import AutoSendToggle from './components/NavPanel/AutoSendToggle';
import ChatPanel from './components/NavPanel/ChatPanel';
import Toast from './components/Toast';

import type ChatModel from './models/Chat';
import type MessageModel from './models/Message';
import type Quote from './models/Quote';
import type User from './models/User';

import { initChats } from './initData';
import { generateObjectId } from './utils/generateObjectId';

import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

const url = import.meta.env.VITE_SERVER_URL;

interface Toast {
  id: string;
  botName: string;
  message: string;
}

function App() {
  const [chats, setChats] = useState<ChatModel[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const currentChatIdRef = useRef<string | null>(currentChatId);
  currentChatIdRef.current = currentChatId;

  const [user, setUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [botTypingChatId, setBotTypingChatId] = useState<string | null>(null);

  const [isAutoSendOn, setIsAutoSendOn] = useState(false);
  const isAutoSendOnRef = useRef(isAutoSendOn);
  isAutoSendOnRef.current = isAutoSendOn;

  const currentChat = useMemo(() => {
    return chats.find((c) => c._id === currentChatId);
  }, [chats, currentChatId]);

  const filteredChats = useMemo(
    () =>
      chats.filter((chat) =>
        chat.botName
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase()),
      ),
    [chats, searchTerm],
  );

  const getRandomChat = useCallback(() => {
    if (chats.length <= 0) return null;
    const randomIdx = (Math.random() * chats.length) | 0;
    return chats[randomIdx];
  }, [chats]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${url}/auth/status`, {
        credentials: 'include',
      });
      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      console.error('Error checking auth status:', err);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const remoteSaveChats = useCallback(
    async (chatsToSave: ChatModel[]) => {
      if (!user) return;
      try {
        await fetch(`${url}/chats`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chats: chatsToSave }),
        });
      } catch (err) {
        console.error('Error saving chats:', err);
      }
    },
    [user],
  );

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
        setChats(initChats);
        remoteSaveChats(initChats);
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  }, [remoteSaveChats]);

  useEffect(() => {
    if (user) {
      fetchChats();
    } else {
      setChats(initChats);
    }
  }, [user, fetchChats]);

  const appendMessage = useCallback(
    (message: MessageModel, chatId: string | null = currentChatId) => {
      if (!chatId) return;
      setChats((prev) => {
        const newChats = prev.map((chat) =>
          chat._id === chatId
            ? { ...chat, messages: [...chat.messages, message] }
            : chat,
        );
        remoteSaveChats(newChats);
        return newChats;
      });
    },
    [currentChatId, remoteSaveChats],
  );

  const fetchQuote = useCallback(
    async (chatId: string | null = currentChatId) => {
      setBotTypingChatId(chatId);
      const prevChatId = chatId;
      try {
        const res = await fetch(`${url}/quote/in3sec`);
        const data: { quote: Quote } = await res.json();
        const message: MessageModel = {
          _id: generateObjectId(),
          isBot: true,
          content: data.quote.content,
          timestamp: new Date(),
        };
        appendMessage(message, chatId);

        // previous reference was closed upon closure
        const newChatId = currentChatIdRef.current;

        if (prevChatId !== newChatId) {
          const chat = chats.find((chat) => chat._id === prevChatId);
          chat && showToast(message.content, chat.botName);
        }
      } catch (err) {
        console.error('Error fetching quote:', err);
      } finally {
        setBotTypingChatId(null);
      }
    },
    [appendMessage, chats, currentChatId],
  );

  useEffect(() => {
    let timeoutId: number;

    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = 0;
      }
    };

    const autoSend = () => {
      if (!isAutoSendOnRef.current) {
        cleanup();
        return;
      }

      const randomChat = getRandomChat();
      randomChat && fetchQuote(randomChat._id);

      const randomDelay = ((Math.random() * 5000) | 0) + 5000;
      timeoutId = setTimeout(autoSend, randomDelay);
    };

    if (isAutoSendOnRef.current) {
      autoSend();
    } else {
      cleanup();
    }

    return cleanup;
  }, [isAutoSendOn, getRandomChat, fetchQuote]);

  const showToast = (message: string, botName: string) => {
    const id = generateObjectId();
    setToasts((prevToasts) => [...prevToasts, { id, message, botName }]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
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

  const handleToggleSelectChat = (chatId: string) => {
    setCurrentChatId((prev) => (prev === chatId ? null : chatId));
  };

  const remoteDeleteChat = async (chatId: string) => {
    if (!user) return;
    try {
      await fetch(`${url}/chats/${chatId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Error deleting chat:', err);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => {
      const newChats = prev.filter((chat) => chat._id !== chatId);
      user && remoteDeleteChat(chatId);
      return newChats;
    });
  };

  const handleCreateChat = (botName: string) => {
    if (!botName) return;
    const newChat: ChatModel = {
      _id: generateObjectId(),
      ownerId: user ? user._id : null,
      botName: botName,
      messages: [],
    };
    setChats((prev) => {
      const newChats = [...prev, newChat];
      user && remoteSaveChats(newChats);
      return newChats;
    });
  };

  const handleBotRename = (chatId: string, newBotName: string) => {
    if (!chats.some((c) => c._id === chatId)) return;
    setChats((prev) => {
      const newChats = prev.map((chat) =>
        chat._id === chatId ? { ...chat, botName: newBotName } : chat,
      );
      user && remoteSaveChats(newChats);
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
      user && remoteSaveChats(newChats);
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
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <>
      <main className='main'>
        <aside className='sidebar'>
          <NavPanel>
            <AuthPanel
              user={user}
              isChecking={isChecking}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
            <OptionsPanel>
              <ThemeToggle />
              <AutoSendToggle
                isAutoSendOn={isAutoSendOn}
                toggleIsAutoSendOn={() => setIsAutoSendOn((iaso) => !iaso)}
              />
            </OptionsPanel>
            <ChatPanel
              query={searchTerm}
              setQuery={(q: string) => setSearchTerm(q)}
              onCreate={(botName: string) => handleCreateChat(botName)}
            />
          </NavPanel>
          <ChatList
            chats={filteredChats}
            onSelect={(id: string) => handleToggleSelectChat(id)}
            onDelete={(id: string) => handleDeleteChat(id)}
            onRename={(chatId: string, botName: string) =>
              handleBotRename(chatId, botName)
            }
          />
        </aside>
        <section className='chat-section'>
          {currentChat ? (
            <Chat>
              <ChatHead botName={currentChat.botName} />
              <MessageList
                botName={currentChat.botName}
                isBotTyping={botTypingChatId === currentChat._id}
                messages={currentChat.messages}
                onEdit={(messageId: string, newContent: string) =>
                  handleMessageEdit(currentChat._id, messageId, newContent)
                }
              />
              <ChatInput onSubmit={handleSend} />
            </Chat>
          ) : (
            <p className='no-chat-selected'>Please select one of the chats</p>
          )}
        </section>
      </main>
      <div className='toast-container'>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            botName={toast.botName}
            onClose={() => removeToast(toast.id)}
            onClick={() => {
              setCurrentChatId(
                chats.find((c) => c.botName === toast.botName)?._id || null,
              );
              removeToast(toast.id);
            }}
          />
        ))}
      </div>
    </>
  );
}

export default App;
