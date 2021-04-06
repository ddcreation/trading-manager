import { Request, Response, Router } from 'express';
import { verifySignUp } from '@middlewares/SignUp';

interface SigninRequest {
  email: string;
  password: string;
  passwordConfirm: string;
}

const router = Router();

router.post(
  '/signin',
  [verifySignUp.checkPasswordConfirm, verifySignUp.checkDuplicateUser],
  (req: Request, res: Response) => {
    res.json();
  }
);
