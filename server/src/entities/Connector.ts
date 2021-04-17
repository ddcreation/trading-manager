import { DbEntity } from './DbEntity';

export interface UserConnectorConfig extends DbEntity {
  user_id: string;
  connector_id: string;
  enabled: boolean;
  properties: {
    [prop: string]: unknown;
  };
}

export interface Connector {
  id: string;
  properties: { name: string; type: string }[];
}
