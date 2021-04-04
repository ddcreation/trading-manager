import uniqid from 'uniqid';

export interface IUser {
  id: string;
  name: string;
  email: string;
}

class User implements IUser {
  public id: string;
  public name: string;
  public email: string;

  constructor(user: IUser) {
    this.name = user.name;
    this.email = user.email;
    this.id = user.id || uniqid();
  }
}

export default User;
