import { hashPassword } from '../utils/crypto';
import { DbEntity } from './DbEntity';

export interface TokenUser {
  _id: string;
  username: string;
}

export interface IUser extends DbEntity {
  username: string;
  password: string;
  connectors: unknown[];
}

class User implements IUser {
  public password: string;
  public username: string;
  public connectors: unknown[];

  constructor(user: IUser) {
    this.username = user.username;
    this.password = hashPassword(user.password);
    this.connectors = user.connectors || [];
  }
}

export default User;
