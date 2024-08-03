import { NextFunction, Request, Response } from 'express';
import ExpressError from '../utils/ExpressError.js';

export const errorHandler = (
  err: ExpressError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  const statusCode = err.status || 500;
  const errMessage = err.message || 'Something went wrong';
  res.status(statusCode).send({ errMessage });
};
