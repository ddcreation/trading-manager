import { UserDao } from '@daos/User/UserDao';
import { NextFunction, Request, Response } from 'express';

const userDao = new UserDao();

const checkDuplicateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).send({ message: 'Email required' });
  }

  const existingUser = await userDao.find$({ email });

  if (existingUser) {
    res.status(400).send({ message: 'User already exists' });
    return;
  }

  next();
};

const checkPasswordConfirm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password, passwordConfirm } = req.body;

  if (!password) {
    res.status(400).send({ message: 'Password required' });
    return;
  }

  if (password !== passwordConfirm) {
    res.status(400).send({ message: 'Password differs' });
    return;
  }

  next();
};

export const verifySignUp = {
  checkDuplicateUser,
  checkPasswordConfirm,
};
