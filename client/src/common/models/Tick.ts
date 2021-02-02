export interface Tick {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  assetVolume: number;
  trades: number;
  buyBaseVolume: number;
  buyAssetVolume: number;
  ignored: number;
}
