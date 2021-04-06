import { Request, Response, Router } from 'express';
import { verifySignUp } from '@middlewares/SignUp';
import { UserDao } from '@daos/User/UserDao';

const router = Router();
const userDao = new UserDao();

router.post(
  '/signin',
  [verifySignUp.checkPasswordConfirm, verifySignUp.checkDuplicateUser],
  async (req: Request, res: Response) => {
    try {
      const newUser = await userDao.add$(req.body);
    } catch (error) {
      res.status(500).send({ message: 'Error adding user' });
      return;
    }

    res.status(201).json();
  }
);

export default router;
