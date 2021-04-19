export interface ConnectorAccount {
  favoritesSymbols: string[];
  connectorDatas: {
    [key: string]: unknown;
  };
}
