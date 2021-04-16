import { UserDao } from '@daos/User/UserDao';
import { TokenUser } from '@entities/User';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err, user) => {
        if (err) {
          return res.sendStatus(401);
        }

        req.user = user as TokenUser;
        next();
      }
    );
  } else {
    res.sendStatus(401);
  }
};

const userDao = new UserDao();

export const checkDuplicateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body;

  if (!username) {
    res.status(400).send({ message: 'Username required' });
  }

  const existingUser = await userDao.find$({ username });

  if (existingUser.length) {
    res.status(400).send({ message: 'User already exists' });
    return;
  }

  next();
};
