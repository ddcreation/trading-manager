import { Request } from 'express-serve-static-core';
import { TokenUser } from '@entities/User';

declare module 'express-serve-static-core' {
  interface Request {
    user: TokenUser;
  }
}
