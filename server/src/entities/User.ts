import { hashPassword } from '../utils/crypto';
import { DbEntity } from './DbEntity';

export interface TokenUser {
  _id: string;
  username: string;
}

export interface IUser extends DbEntity {
  username: string;
  password: string;
}

class User implements IUser {
  public password: string;
  public username: string;

  constructor(user: IUser) {
    this.username = user.username;
    this.password = hashPassword(user.password);
  }
}

export default User;
