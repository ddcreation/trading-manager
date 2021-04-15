import { NextFunction, Request, Response } from 'express';

export const validateLoginRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send({ message: 'Username and password required' });
    return;
  }

  next();
};
