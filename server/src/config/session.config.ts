import session from 'express-session';
import MongoStore from 'connect-mongo';
import { inProduction, dbUrl, dbName } from './global.config.js';

export const configureSession = () => {
  return session({
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: true, // debug
    store: MongoStore.create({
      mongoUrl: dbUrl,
      dbName,
      touchAfter: 24 * 3600,
    }),
    cookie: {
      secure: inProduction,
      httpOnly: true,
      sameSite: inProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  });
};
