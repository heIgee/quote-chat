import { configDotenv } from 'dotenv';
import express from 'express';
import passport from 'passport';
import cors from 'cors';

import { inProduction, clientUri } from './config/global.config.js';
import { connectMongo } from './config/mongo.config.js';
import { configurePassport } from './config/passport.config.js';
import { configureSession } from './config/session.config.js';

import authRouter from './routes/authRouter.js';
import quoteRouter from './routes/quoteRouter.js';
import chatsRouter from './routes/chatsRouter.js';

import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

const app = express();

if (!inProduction) configDotenv();

connectMongo();

app.set('trust proxy', 1);

app.use(express.json());

app.use(cors({ origin: clientUri, credentials: true }));
app.use(configureSession());

app.use(passport.initialize());
app.use(passport.session());
configurePassport();

app.use(requestLogger);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server is up and running',
    mode: inProduction ? 'production' : 'development',
    serverUri: `${req.protocol}://${req.get('host')}`,
    clientUri,
    timestamp: new Date().toISOString(),
  });
});

app.use('/auth', authRouter);
app.use('/quote', quoteRouter);
app.use('/chats', chatsRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  inProduction
    ? console.log(`[production] 🚀 Server is listening on port ${PORT}`)
    : console.log(`[development] 🚀 Server is listening on port ${PORT}`);
});
