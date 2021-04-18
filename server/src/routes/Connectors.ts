import { Request, Response, Router } from 'express';
import { ExchangeInfoResponse } from '@entities/ExchangeInfoResponse';
import TradingConnector from '@shared/TradingConnector';
import { CryptoFilterType } from '@entities/CryptoApiParams';
import { Simulator } from '@shared/Simulator';
import { connectors } from '@shared/connectors';
import { StatusCodes } from 'http-status-codes';
import { AuthRequest } from '@entities/User';
import { UserConnectorConfigDao } from '@daos/UserConnectorConfig/UserConnectorConfigDao';
import { UserConnectorConfig } from '@entities/Connector';

const router = Router();

const userConnectorConfigDao = new UserConnectorConfigDao();

router.get('/', (req: Request, res: Response) => {
  res.json(connectors);
});

router.get(
  '/:connectorId/user-connector-config',
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    const { connectorId } = req.params;

    const config = await userConnectorConfigDao.getConfigForUser$(
      connectorId,
      user._id
    );

    if (config) {
      return res.status(StatusCodes.OK).send(config);
    }

    return res.sendStatus(StatusCodes.NOT_FOUND);
  }
);

router.put(
  '/:connectorId/user-connector-config',
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    const { connectorId } = req.params;

    const config = {
      ...req.body,
      user_id: user._id,
      connector_id: connectorId,
    };

    const replace = await userConnectorConfigDao.replace$(
      { connector_id: connectorId, user_id: user._id },
      config
    );

    return res.sendStatus(
      replace ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
);

router.get('/account', async (req: Request, res: Response) => {
  const account = await TradingConnector.getAccount$();

  res.json(account);
});

router.get('/exchange-info', async (req: Request, res: Response) => {
  const exchangeInfos: ExchangeInfoResponse = await TradingConnector.exchangeInfo$(
    CryptoFilterType.favorites
  );

  res.json(exchangeInfos);
});

router.get('/favorites', async (req: Request, res: Response) => {
  const account = await TradingConnector.getAccount$();

  res.json(account.favoritesSymbols);
});

router.get('/prices', async (req: Request, res: Response) => {
  const prices = await TradingConnector.symbolPrices$();

  res.json(prices);
});

router.get('/:symbol/history', async (req: Request, res: Response) => {
  const history = await TradingConnector.symbolHistory$(req.params.symbol);

  res.json(history);
});

router.get('/:symbol/simulations', async (req: Request, res: Response) => {
  // Generate simulations:
  const simulator = new Simulator();
  const simulations = await simulator.simulate$({ symbol: req.params.symbol });

  res.json({
    symbol: req.params.symbol,
    simulations,
  });
});

export default router;
