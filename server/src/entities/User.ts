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
    this.password = user.password;
    this.id = user.id || uniqid();
  }
}

export default User;
