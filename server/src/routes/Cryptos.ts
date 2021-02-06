import { Request, Response, Router } from 'express';
import { ExchangeInfoResponse } from '@entities/ExchangeInfoResponse';
import CryptoProviderApi from '../shared/CryptoProviderApi';
import { CryptoFilterType } from '@entities/CryptoApiParams';

const router = Router();

router.get('/account', async (req: Request, res: Response) => {
  const account = await CryptoProviderApi.getAccount$();

  res.json(account);
});

router.get('/exchange-info', async (req: Request, res: Response) => {
  const exchangeInfos: ExchangeInfoResponse = await CryptoProviderApi.exchangeInfo$(
    CryptoFilterType.favorites
  );

  res.json(exchangeInfos);
});

router.get('/favorites', async (req: Request, res: Response) => {
  const account = await CryptoProviderApi.getAccount$();

  res.json(account.preferences.favoritesSymbols);
});

router.get('/prices', async (req: Request, res: Response) => {
  const prices = await CryptoProviderApi.symbolPrices$();

  res.json(prices);
});

router.get('/:symbol/history', async (req: Request, res: Response) => {
  const history = await CryptoProviderApi.symbolHistory$(req.params.symbol);

  res.json(history);
});

router.get('/:symbol/simulations', async (req: Request, res: Response) => {
  const simulations: unknown = [];

  // TODO Get history:

  // TODO Generate simulations:

  res.json(simulations);
});

export default router;
