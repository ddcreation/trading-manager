import User, { IUser } from '@entities/User';
import { DatabaseConnector } from '@shared/DatabaseConnector';
import { FilterQuery } from 'mongodb';

export class UserDao {
  private _connector: DatabaseConnector<IUser>;

  constructor() {
    this._connector = new DatabaseConnector('users');
  }

  public find$(params: FilterQuery<IUser>) {
    return this._connector.find$(params);
  }

  public getOne$(id: string): Promise<IUser | null> {
    // TODO
    return Promise.resolve(null);
  }

  public getAll$(): Promise<IUser[]> {
    return this._connector.getAll$();
  }

  public async add$(user: IUser): Promise<void> {
    const newUser = new User(user);
    await this._connector.add$(newUser);

    return;
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
