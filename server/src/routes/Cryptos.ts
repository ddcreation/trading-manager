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

export default router;
