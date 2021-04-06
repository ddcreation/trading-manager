import * as jwt from 'jsonwebtoken';
import { Request, Response, Router } from 'express';
import { verifySignUp } from '@middlewares/SignUp';
import { UserDao } from '@daos/User/UserDao';
import { validateLoginRequest } from '@middlewares/Login';
import { RefreshTokenDao } from '@daos/Session/RefreshTokenDao';

const router = Router();
const userDao = new UserDao();
const refreshTokensDao = new RefreshTokenDao();

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

router.post(
  '/login',
  validateLoginRequest,
  async (req: Request, res: Response) => {
    // read username and password from request body
    const { username, password } = req.body;

    // filter user from the users array by username and password
    const [user] = await userDao.find$({ username, password });

    if (user) {
      // generate an access token
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '20m' }
      );

      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET as string
      );

      await refreshTokensDao.add$(refreshToken);

      res.json({
        accessToken,
        refreshToken,
      });
    } else {
      res.status(404).send('Username or password incorrect');
    }
  }
);

export default router;
