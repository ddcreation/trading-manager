export interface ConnectorConfig {
  id: string;
  name: string;
  properties: {
    [propName: string]: { label: string; type: string };
  };
  config?: {
    [propName: string]: unknown;
    enabled: boolean;
    favoritesAssets: string[];
  };
}
