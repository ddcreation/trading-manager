import { hashPassword } from '../utils/crypto';
import uniqid from 'uniqid';

export interface IUser {
  id: string;
  username: string;
  password: string;
}

class User implements IUser {
  public id: string;
  public password: string;
  public username: string;

  constructor(user: IUser) {
    this.username = user.username;
    this.password = hashPassword(user.password);
    this.id = user.id || uniqid();
  }
}

export default User;
