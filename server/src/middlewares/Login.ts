import { UserDao } from '@daos/User/UserDao';
import { NextFunction, Request, Response } from 'express';

const userDao = new UserDao();

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
