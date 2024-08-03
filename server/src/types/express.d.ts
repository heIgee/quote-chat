import { Express } from 'express-serve-static-core';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface User {
      _id: mongoose.Types.ObjectId;
      googleId: string;
      displayName: string;
      email: string;
    }
  }
}
