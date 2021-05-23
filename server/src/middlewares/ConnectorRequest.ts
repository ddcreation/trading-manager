import { NextFunction, Request, Response } from 'express';

export const validateConnectorRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.params.connectorId) {
    res.status(400).send({ message: 'Missing connector' });
    return;
  }

  next();
};
