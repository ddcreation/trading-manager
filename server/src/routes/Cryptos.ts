import binance from '@shared/binance';
import { Request, Response, Router } from 'express';

const router = Router();

router.get('/account', async (req: Request, res: Response) => {
  const account = await binance.account();

  res.json(account);
});

router.get('/exchange-info', async (req: Request, res: Response) => {
  // TODO: reactivate exchange infos with favorite filters:
  res.sendStatus(500);
  return;
  const exchangeInfos = await binance.exchangeInfo();

  res.json(exchangeInfos);
});

router.get('/prices', async (req: Request, res: Response) => {
  const prices = await binance.prices();

  res.json(prices);
});

export default router;
