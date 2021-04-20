import { DatabaseConnector } from '@daos/DatabaseConnector';
import { UserConnectorConfig } from '@entities/Connector';
import { FilterQuery } from 'mongodb';

export class UserConnectorConfigDao {
  private _connector: DatabaseConnector<UserConnectorConfig>;

  constructor() {
    this._connector = new DatabaseConnector('connector_user_config');
  }

  public async getConfigForUser$(connector_id: string, user_id: string) {
    const config = await this._connector.find$({ user_id, connector_id });

    return config[0] || null;
  }

  public async add$(config: UserConnectorConfig): Promise<UserConnectorConfig> {
    return await this._connector.add$(config);
  }

  public async update$(
    filters: FilterQuery<UserConnectorConfig>,
    config: Partial<UserConnectorConfig>
  ): Promise<UserConnectorConfig> {
    return await this._connector.updateOne$(filters, config);
  }

  public async replace$(
    filters: FilterQuery<UserConnectorConfig>,
    config: UserConnectorConfig
  ): Promise<UserConnectorConfig> {
    return await this._connector.replace$(filters, config);
  }
}
