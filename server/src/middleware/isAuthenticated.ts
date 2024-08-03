import { Request, Response, NextFunction } from 'express';
import ExpressError from '../utils/ExpressError.js';

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    throw new ExpressError(401, 'This route requires authentication');
  }
};
