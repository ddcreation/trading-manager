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
          return res.sendStatus(403);
        }

        req.user = user as TokenUser;
        next();
      }
    );
  } else {
    res.sendStatus(401);
  }
};
