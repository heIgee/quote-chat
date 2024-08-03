import { configDotenv } from 'dotenv';
import express, { NextFunction } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';

import { connectMongo } from './config/mongo.config.js';
import { configureSession } from './config/session.config.js';
import authRouter from './routes/authRouter.js';
import quoteRouter from './routes/quoteRouter.js';
import chatsRouter from './routes/chatsRouter.js';

const app = express();

import { inProduction, clientUri } from './config/global.config.js';
import { configurePassport } from './config/passport.config.js';
import { errorHandler } from './middleware/errorHandler.js';

if (!inProduction) configDotenv();

connectMongo();

app.set('trust proxy', 1);

app.use(express.json());

app.use(cors({ origin: clientUri, credentials: true }));
app.use(configureSession());

app.use(passport.initialize());
app.use(passport.session());
configurePassport();

app.use('/auth', authRouter);
app.use('/quote', quoteRouter);
app.use('/chats', chatsRouter);

app.get('/env', (req, res) => {
  const nodeEnv = process.env.NODE_ENV || 'NOT SET';
  res.json({ nodeEnv, clientUri });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  inProduction
    ? console.log(`[production] 🚀 Server is listening on port ${PORT}`)
    : console.log(`[development] 🚀 Server is listening on port ${PORT}`);
});
