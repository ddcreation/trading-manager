export interface CryptoAccountPreferences {
  favoritesSymbols: string[];
}

export interface CryptoAccount {
  preferences: CryptoAccountPreferences;
  [key: string]: unknown;
}
