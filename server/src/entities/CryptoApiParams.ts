export const IntervalType = {
  '1m': '1m' as '1m',
  '3m': '3m' as '3m',
  '5m': '5m' as '5m',
  '15m': '15m' as '15m',
  '30m': '30m' as '30m',
  '1h': '1h' as '1h',
  '2h': '2h' as '2h',
  '4h': '4h' as '4h',
  '6h': '6h' as '6h',
  '8h': '8h' as '8h',
  '12h': '12h' as '12h',
  '1d': '1d' as '1d',
  '3d': '3d' as '3d',
  '1w': '1w' as '1w',
  '1M': '1M' as '1M',
};

export type IntervalType = keyof typeof IntervalType;

export const CryptoFilterType = {
  all: 'all' as 'all',
  favorites: 'favorites' as 'favorites',
};

export type CryptoFilterType = keyof typeof CryptoFilterType;

export interface HistoryParams {
  endTime?: number;
  limit?: number;
}
