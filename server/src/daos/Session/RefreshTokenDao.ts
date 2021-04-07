import { DatabaseConnector } from '@shared/DatabaseConnector';
import { DbEntity } from '@entities/DbEntity';

interface RefreshToken extends DbEntity {
  user_id: string;
  token: string;
}

export class RefreshTokenDao {
  private _connector: DatabaseConnector<RefreshToken>;

  constructor() {
    this._connector = new DatabaseConnector('tokens');
  }

  public async add$(userId: string, refreshToken: string): Promise<void> {
    await this._connector.add$({ token: refreshToken, user_id: userId });

    return;
  }

  public async deleteForUser$(userId: string): Promise<void> {
    await this._connector.delete$({ user_id: userId });

    return;
  }
  public async find$(refreshToken: string): Promise<RefreshToken | null> {
    const [token] = await this._connector.find$({ token: refreshToken });
    return token || null;
  }
}
