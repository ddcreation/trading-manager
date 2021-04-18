import { Request } from 'express';
import { hashPassword } from '../utils/crypto';
import { UserConnectorConfig } from './Connector';
import { DbEntity } from './DbEntity';

export interface TokenUser {
  _id: string;
  username: string;
}

export interface AuthRequest extends Request {
  user: TokenUser;
}

export interface IUser extends DbEntity {
  username: string;
  password: string;
  connectors: UserConnectorConfig[];
}

class User implements IUser {
  public password: string;
  public username: string;
  public connectors: UserConnectorConfig[];

  constructor(user: IUser) {
    this.username = user.username;
    this.password = hashPassword(user.password);
    this.connectors = user.connectors || [];
  }
}

export default User;
