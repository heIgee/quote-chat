import { Request, Response, NextFunction } from 'express';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userEmail = req.user?.email || 'guest';
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${
      req.originalUrl
    } [${userEmail}]`,
  );
  next();
};
