import express from 'express';
import asyncHandler from 'express-async-handler';
import Quote from '../models/Quote.js';

const router = express.Router();

const backupQuotes: Quote[] = [
  {
    author: 'Albert Einstein',
    content:
      'Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.',
    length: 98,
    tags: ['imagination', 'knowledge', 'science'],
  },
  {
    author: 'Maya Angelou',
    content:
      "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.",
    length: 134,
    tags: ['inspiration', 'life', 'memory'],
  },
  {
    author: 'William Shakespeare',
    content:
      "All the world's a stage, and all the men and women merely players. They have their exits and their entrances; And one man in his time plays many parts.",
    length: 157,
    tags: ['life', 'theater', 'philosophy'],
  },
  {
    author: 'Nelson Mandela',
    content:
      'The greatest glory in living lies not in never falling, but in rising every time we fall.',
    length: 87,
    tags: ['inspiration', 'perseverance', 'life'],
  },
  {
    author: 'Jane Austen',
    content:
      'For what do we live, but to make sport for our neighbors, and laugh at them in our turn?',
    length: 88,
    tags: ['humor', 'life', 'society'],
  },
];

router.get(
  '/now',
  asyncHandler(async (req, res) => {
    let quote: Quote;
    try {
      const quoteRes = await fetch('https://api.quotable.io/random');
      quote = await quoteRes.json();
    } catch (error) {
      quote = backupQuotes[Math.floor(Math.random() * backupQuotes.length)];
    }
    res.status(200).json({ quote });
  }),
);

router.get(
  '/in3sec',
  asyncHandler(async (req, res) => {
    const startTime = Date.now();

    let quote: Quote;
    try {
      const quoteResponse = await fetch('https://api.quotable.io/random');
      quote = await quoteResponse.json();
    } catch (error) {
      quote = backupQuotes[Math.floor(Math.random() * backupQuotes.length)];
    }

    const elapsedTime = Date.now() - startTime;

    if (elapsedTime < 3000) {
      await new Promise((resolve) => setTimeout(resolve, 3000 - elapsedTime));
    }

    res.json({ quote });
  }),
);

export default router;
