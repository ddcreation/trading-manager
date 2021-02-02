import { ExchangeInfoResponse } from '@entities/ExchangeInfoResponse';
import binance from '@shared/binance';
import { Request, Response, Router } from 'express';

const router = Router();

// TODO: get this list from user preferences
const favoritesCrypto = ['ETHUSDT', 'BCHUSDT', 'BTCUSDT', 'LTCUSDT', 'XRPUSDT'];

router.get('/account', async (req: Request, res: Response) => {
  const account = await binance.account();

  res.json(account);
});

router.get('/exchange-info', async (req: Request, res: Response) => {
  const exchangeInfos: ExchangeInfoResponse = await binance.exchangeInfo();

  const favoriteSymbols = exchangeInfos.symbols
    .filter((symbol) => favoritesCrypto.includes(symbol.symbol))
    .sort((a, b) =>
      favoritesCrypto.indexOf(a.symbol) > favoritesCrypto.indexOf(b.symbol)
        ? 1
        : -1
    );

  res.json({ ...exchangeInfos, symbols: favoriteSymbols });
});

router.get('/favorites', async (req: Request, res: Response) => {
  res.json(favoritesCrypto);
});

router.get('/prices', async (req: Request, res: Response) => {
  const prices = await binance.prices();

  res.json(prices);
});

router.get('/:symbol/history', async (req: Request, res: Response) => {
  const history = await new Promise((resolve, reject) => {
    // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
    binance.candlesticks(
      req.params.symbol,
      '5m',
      (error: unknown, ticks: Array<string[]>, symbol: string) => {
        if (error) {
          reject(error);
        }

        const formatedTicks = ticks.map((tick) => {
          const [
            time,
            open,
            high,
            low,
            close,
            volume,
            closeTime,
            assetVolume,
            trades,
            buyBaseVolume,
            buyAssetVolume,
            ignored,
          ] = tick.map((value) => parseFloat(value));
          return {
            assetVolume,
            buyAssetVolume,
            buyBaseVolume,
            close,
            closeTime,
            high,
            ignored,
            low,
            open,
            time,
            trades,
            volume,
          };
        });
        resolve(formatedTicks);
      },
      { limit: 100 /*, endTime: 1514764800000*/ }
    );
  });

  res.json(history);
});

export default router;
