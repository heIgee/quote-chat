import express from 'express';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.get(
  '/now',
  asyncHandler(async (req, res) => {
    const quoteRes = await fetch('https://api.quotable.io/random');
    const quote = await quoteRes.json();
    res.status(200).json({ quote });
  }),
);

router.get(
  '/in3sec',
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

export default router;
