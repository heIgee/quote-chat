import express from 'express';
import cors from 'cors';

import asyncHandler from 'express-async-handler';

import { message } from './test.js';

const app = express();

app.use(cors());

app.get(
  '/',
  asyncHandler(async (req, res) => {
    const quoteRes = await fetch('https://api.quotable.io/random');
    const quote = await quoteRes.json();
    res.status(200).json({ quote });
  }),
);

app.get(
  '/quote3sec',
  asyncHandler(async (req, res) => {
    const startTime = Date.now();

    const quotePromise = fetch('https://api.quotable.io/random').then(
      (response) => response.json(),
    );

    const delayPromise = new Promise((resolve) => setTimeout(resolve, 3000));

    const [quote] = await Promise.all([quotePromise, delayPromise]);

    const elapsedTime = Date.now() - startTime;

    if (elapsedTime < 3000) {
      await new Promise((resolve) => setTimeout(resolve, 3000 - elapsedTime));
    }

    res.json({ quote });
  }),
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
