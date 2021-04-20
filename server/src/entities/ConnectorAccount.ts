export interface ConnectorAccount {
  favoritesAssets: string[];
  connectorDatas: {
    [key: string]: unknown;
  };
}
