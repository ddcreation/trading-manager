import User, { IUser } from '@entities/User';

export class UserDao {
  public getOne$(id: string): Promise<IUser | null> {
    // TODO
    return Promise.resolve(null);
  }

  public getAll$(): Promise<IUser[]> {
    // TODO
    return Promise.resolve([]);
  }

  public async add$(user: IUser): Promise<void> {
    const newUser = new User(user);
    // TODO
    return Promise.resolve(undefined);
  }

  public async update$(user: IUser): Promise<void> {
    // TODO
    return Promise.resolve(undefined);
  }

  public async delete$(id: string): Promise<void> {
    // TODO
    return Promise.resolve(undefined);
  }
}
