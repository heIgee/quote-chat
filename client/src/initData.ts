import type ChatModel from './models/Chat';
import { generateObjectId } from './utils/generateObjectId';

export const initChats: ChatModel[] = [
  {
    _id: generateObjectId(),
    ownerId: null,
    botName: 'Albert Einstein',
    messages: [
      {
        _id: generateObjectId(),
        isBot: true,
        content: `Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.`,
        timestamp: new Date('2024-08-01T04:20:00Z'),
      },
      {
        _id: generateObjectId(),
        isBot: false,
        content: `That's a great quote. Imagination certainly plays a crucial role in driving innovation.`,
        timestamp: new Date('2024-08-01T04:29:00Z'),
      },
      {
        _id: generateObjectId(),
        isBot: true,
        content: `The important thing is not to stop questioning. Curiosity has its own reason for existing.`,
        timestamp: new Date('2024-08-01T04:29:00Z'),
      },
      {
        _id: generateObjectId(),
        isBot: false,
        content: `Indeed, curiosity is a powerful motivator. It leads us to explore new ideas and solve complex problems.`,
        timestamp: new Date('2024-08-01T04:56:00Z'),
      },
    ],
  },
  {
    _id: generateObjectId(),
    ownerId: null,
    botName: 'Robert M. Pirsig',
    messages: [
      {
        _id: generateObjectId(),
        isBot: true,
        content: `The place to improve the world is first in one's own heart and head and hands.`,
        timestamp: new Date('2024-08-02T13:46:00Z'),
      },
    ],
  },
  {
    _id: generateObjectId(),
    ownerId: null,
    botName: 'Marie Curie',
    messages: [
      {
        _id: generateObjectId(),
        isBot: true,
        content: `Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.`,
        timestamp: new Date('2024-08-03T19:12:00Z'),
      },
      {
        _id: generateObjectId(),
        isBot: false,
        content: `Absolutely. Understanding can lead to better solutions and reduce our fears. Approaching new concepts with curiosity can be very beneficial.`,
        timestamp: new Date('2024-08-03T19:23:00Z'),
      },
    ],
  },
];
