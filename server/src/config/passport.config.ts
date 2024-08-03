import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { inProduction } from './global.config.js';
import User from '../models/User.js';

export const configurePassport = () => {
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user as any);
    } catch (error) {
      done(error, null);
    }
  });

  // TODO fix oauth uri_mismatch without hardcoding uri
  const callbackURL = inProduction
    ? 'https://server-quiet-waterfall-3430.fly.dev/auth/google/callback'
    : 'http://localhost:3000/auth/google/callback';

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: callbackURL,
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
          return done(null, user as any);
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
};
