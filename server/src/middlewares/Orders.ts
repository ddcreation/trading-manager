import { NextFunction, Request, Response } from 'express';

export const validateOrderRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount = null, symbol = null, direction = null } = req.body;

  if (
    amount === null ||
    symbol === null ||
    direction === null ||
    +amount === 0
  ) {
    res.status(400).send({ message: 'Missing parameter' });
    return;
  }

  next();
};
