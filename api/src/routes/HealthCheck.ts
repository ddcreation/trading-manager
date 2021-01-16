import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const { OK } = StatusCodes;

const router = Router();

router.get('/', (req: Request, res: Response) => {
  return res.status(OK).send('API is working properly');
});

export default router;
