import mongoose from 'mongoose';
import { dbUrl, dbName } from './global.config.js';

export const connectMongo = () => {
  mongoose.connect(dbUrl, { dbName });

  const db = mongoose.connection;

  db.on('error', (err) => {
    console.error('MongoDB failed:', err);
  });

  db.once('open', async () => {
    console.log('MongoDB connected');
  });
};
