import * as jwt from 'jsonwebtoken';
import { Request, Response, Router } from 'express';
import { verifySignUp } from '@middlewares/SignUp';
import { UserDao } from '@daos/User/UserDao';
import { validateLoginRequest } from '@middlewares/Login';
import { RefreshTokenDao } from '@daos/Session/RefreshTokenDao';
import { hashPassword } from '../utils/crypto';
import { authenticate } from '@middlewares/Auth';
import { TokenUser } from '@entities/User';

const router = Router();
const userDao = new UserDao();
const refreshTokensDao = new RefreshTokenDao();
const accessTokenParams = { expiresIn: '20m' };

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
    const [user] = await userDao.find$({
      username,
      password: hashPassword(password),
    });

    if (user) {
      const tokenUser: TokenUser = {
        _id: user._id?.toHexString() as string,
        username: user.username,
      };

      const accessToken = jwt.sign(
        tokenUser,
        process.env.ACCESS_TOKEN_SECRET as string,
        accessTokenParams
      );
      const refreshToken = jwt.sign(
        tokenUser,
        process.env.REFRESH_TOKEN_SECRET as string
      );

      await refreshTokensDao.add$(
        user._id?.toHexString() as string,
        refreshToken
      );

      res.json({
        accessToken,
        refreshToken,
      });
    } else {
      res.status(404).send('Username or password incorrect');
    }
  }
);

router.post('/refresh', async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  const refreshExist = await refreshTokensDao.find$(token);
  if (!refreshExist) {
    return res.sendStatus(403);
  }

  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err: unknown, tokenUser: any) => {
      if (err) {
        return res.sendStatus(403);
      }

      const accessToken = jwt.sign(
        tokenUser,
        process.env.ACCESS_TOKEN_SECRET as string,
        accessTokenParams
      );

      res.json({
        accessToken,
      });
    }
  );
});

router.post('/logout', authenticate, async (req: Request, res: Response) => {
  const { token } = req.body;

  // Delete all user tokens:
  await new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err: unknown, tokenUser: any) => {
        if (err) {
          reject();
        }

        refreshTokensDao.deleteForUser$(tokenUser._id).then(resolve);
      }
    );
  });

  res.send('Logout successful');
});

export default router;
