import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { UserDao } from '@daos/User/UserDao';
import { IUser } from '@entities/User';

const router = Router();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;
const userDao = new UserDao();

interface UserRequest extends Request {
  body: {
    user: IUser;
  };
}

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

// TODO Reactivate after roles implementation to allow only admins
// router.get('/all', async (req: Request, res: Response) => {
//   const users = await userDao.getAll$();
//   return res.status(OK).json({ users });
// });

const paramMissingError = 'One or more of the required parameters was missing.';

router.get('/me', async (req: Request, res: Response) => {
  const { user } = req;

  const userData = await userDao.getById$(user._id);
  if (!userData) {
    return res.status(404).end();
  }

  return res.status(200).send(userData);
});

router.post('/add', async (req: UserRequest, res: Response) => {
  const { user } = req.body;
  if (!user) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  await userDao.add$(user);
  return res.status(CREATED).end();
});

router.put('/update', async (req: UserRequest, res: Response) => {
  const { user } = req.body as any;
  if (!user) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  await userDao.update$(user);
  return res.status(OK).end();
});

router.delete('/delete/:id', async (req: UserRequest, res: Response) => {
  const { id } = req.params;
  await userDao.delete$(id);
  return res.status(OK).end();
});

export default router;
