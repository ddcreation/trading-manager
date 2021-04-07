import { DatabaseConnector } from '@shared/DatabaseConnector';
import { DbEntity } from '@entities/DbEntity';

interface RefreshToken extends DbEntity {
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

  public async add$(refreshToken: string): Promise<void> {
    await this._connector.add$({ token: refreshToken });

    return;
  }
}
