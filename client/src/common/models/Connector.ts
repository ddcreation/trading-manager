export interface ConnectorConfig {
  id: string;
  name: string;
  config?: ConnectorUserConfig;
  properties: {
    [propName: string]: { label: string; type: string };
  };
}

export interface ConnectorUserConfig {
  [propName: string]: unknown;
  enabled: boolean;
  favoritesAssets: string[];
}
