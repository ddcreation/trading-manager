import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const validateLoginRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: 'Username and password required' });
    return;
  }

  next();
};
