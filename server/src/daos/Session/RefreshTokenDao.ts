import uniqid from 'uniqid';
import { DatabaseConnector } from '@shared/DatabaseConnector';

interface RefreshToken {
  id: string;
  token: string;
}

export class RefreshTokenDao {
  private _connector: DatabaseConnector<RefreshToken>;

  constructor() {
    this._connector = new DatabaseConnector('tokens');
  }

  public async find$(refreshToken: string): Promise<RefreshToken | null> {
    const [token] = await this._connector.find$({ token: refreshToken });
    return token || null;
  }

  public async add$(token: string): Promise<void> {
    await this._connector.add$({ id: uniqid(), token });

    return;
  }
}
