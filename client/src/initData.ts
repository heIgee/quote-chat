import Chat from './models/Chat';

export const initChats: Chat[] = [
  {
    _id: '1',
    ownerId: null,
    botName: 'Robert M. Pirsig',
    messages: [
      {
        isBot: true,
        content: `The place to improve the world is first in one's own heart and head and hands.`,
        timestamp: new Date(),
      },
    ],
  },
  {
    _id: '2',
    ownerId: null,
    botName: 'Albert Einstein',
    messages: [
      {
        isBot: true,
        content: `Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.`,
        timestamp: new Date(),
      },
      {
        isBot: false,
        content: `That's a great quote. How do you think imagination drives innovation?`,
        timestamp: new Date(),
      },
    ],
  },
  {
    _id: '3',
    ownerId: null,
    botName: 'Marie Curie',
    messages: [
      {
        isBot: true,
        content: `Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.`,
        timestamp: new Date(),
      },
      {
        isBot: false,
        content: `Absolutely. Understanding can lead to better solutions and reduce our fears. How do you approach understanding new concepts?`,
        timestamp: new Date(),
      },
    ],
  },
];
