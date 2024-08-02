const inProduction = process.env.NODE_ENV === 'production';

import { configDotenv } from 'dotenv';

if (!inProduction) {
  configDotenv();
}

import express from 'express';
import session from 'express-session';
import asyncHandler from 'express-async-handler';

import cors from 'cors';

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import mongoose from 'mongoose';
import User from './models/User.js';

const app = express();

// MONGO

mongoose.connect(process.env.ATLAS_URL!, { dbName: 'quote' });

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('Mongo failed:', err);
});

db.once('open', async () => {
  console.log('Mongo connected');
});

app.use(cors());

// SESSION

// Set up session
app.use(
  session({
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: false,
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0] ? profile.emails[0].value : '',
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to React app
    console.log(req.user);
    res.redirect(
      inProduction ? 'https://quote-chat.vercel.app/' : 'http://localhost:5173',
    );
  },
);

// Logout route
app.get('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// Check auth status
app.get('/auth/status', (req, res) => {
  res.json({ user: req.user || null });
});

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

// TODO test
app.get('/env', (req, res) => {
  const nodeEnv = process.env.NODE_ENV || 'NOT SET';
  res.json({ nodeEnv });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  inProduction
    ? console.log(`[production] 🚀 Server is listening on port ${PORT}`)
    : console.log(`[development] 🚀 Server is listening on port ${PORT}`);
});
