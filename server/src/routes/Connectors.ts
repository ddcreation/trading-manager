import { Request, Response, Router } from 'express';
import { ExchangeInfoResponse } from '@entities/ExchangeInfoResponse';
import { initConnector } from '@shared/TradingConnector';
import { Simulator } from '@shared/Simulator';
import { connectors } from '@shared/connectors';
import { StatusCodes } from 'http-status-codes';
import { AuthRequest } from '@entities/User';
import { validateOrderRequest } from '@middlewares/Orders';
import { UserConnectorConfigDao } from '@daos/UserConnectorConfig/UserConnectorConfigDao';

const router = Router();

const userConnectorConfigDao = new UserConnectorConfigDao();

router.get('/', async (req: AuthRequest, res: Response) => {
  const { user } = req;
  const connectorsWithConfig = await Promise.all(
    connectors.map((connector) =>
      userConnectorConfigDao
        .getConfigForUser$(connector.id, user._id)
        .then((config) => {
          return { ...connector, config };
        })
    )
  );

  res.json(connectorsWithConfig);
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

router.get('/:connectorId/assets', async (req: AuthRequest, res: Response) => {
  const tradingConnector = await initConnector(
    req.params.connectorId,
    req.user._id
  );

  const assets = await tradingConnector.listAssets$();

  return res.send(assets);
});

router.put(
  '/:connectorId/user-connector-config',
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    const { connectorId } = req.params;

    const filters = { connector_id: connectorId, user_id: user._id };

    const replace = await userConnectorConfigDao.replace$(filters, {
      ...req.body,
      ...filters,
    });

    return res.sendStatus(
      replace ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
);

router.get('/:connectorId/account', async (req: Request, res: Response) => {
  const tradingConnector = await initConnector(
    req.params.connectorId,
    req.user._id
  );

  const account = await tradingConnector.getAccount$();

  res.json(account);
});

router.get(
  '/:connectorId/exchange-info',
  async (req: Request, res: Response) => {
    const tradingConnector = await initConnector(
      req.params.connectorId,
      req.user._id
    );
    const exchangeInfos: ExchangeInfoResponse =
      await tradingConnector.exchangeInfo$();

    res.json(exchangeInfos);
  }
);

router.get('/:connectorId/favorites', async (req: Request, res: Response) => {
  const { user } = req;
  const { connectorId } = req.params;

  const config = await userConnectorConfigDao.getConfigForUser$(
    connectorId,
    user._id
  );

  if (config) {
    return res.status(StatusCodes.OK).send(config.favoritesAssets || []);
  }

  return res.sendStatus(StatusCodes.NOT_FOUND);
});

router.get('/:connectorId/prices', async (req: Request, res: Response) => {
  const tradingConnector = await initConnector(
    req.params.connectorId,
    req.user._id
  );

  const prices = await tradingConnector.assetPrices$();

  res.json(prices);
});

router.get(
  '/:connectorId/:asset/history',
  async (req: Request, res: Response) => {
    const tradingConnector = await initConnector(
      req.params.connectorId,
      req.user._id
    );
    const history = await tradingConnector.assetHistory$(req.params.asset);

    res.json(history);
  }
);

router.get(
  '/:connectorId/:asset/simulations',
  async (req: Request, res: Response) => {
    const tradingConnector = await initConnector(
      req.params.connectorId,
      req.user._id
    );

    // Generate simulations:
    const simulator = new Simulator(tradingConnector);
    const simulations = await simulator.simulate$({
      asset: req.params.asset,
    });

    res.json({
      asset: req.params.asset,
      simulations,
    });
  }
);

router.post(
  '/:connectorId/order',
  validateOrderRequest,
  async (req: AuthRequest, res: Response) => {
    try {
      const tradingConnector = await initConnector(
        req.params.connectorId,
        req.user._id
      );

      const order = await tradingConnector.placeOrder$(req.body);

      return res.json(order);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

export default router;
