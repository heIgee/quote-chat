import express from 'express';
import passport from 'passport';

const router = express.Router();

const inProduction = process.env.NODE_ENV === 'production';
const clientUri = inProduction
  ? 'https://quote-chat.vercel.app'
  : 'http://localhost:5173';

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => {
    // auth successful, redirect to React
    console.log('Authentication successful!');
    console.log('User:', req.user);
    console.log('Session:', req.session);
    res.redirect(clientUri);
  },
);

router.get('/fail', (req, res) => {
  console.log('Authentication failed');
  console.log(req);
  res.json({ error: 'Authentication failed', req });
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/quote/now');
  });
});

router.get('/status', (req, res) => {
  res.json({ user: req.user || null });
});

export default router;
