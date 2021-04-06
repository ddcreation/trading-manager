import { Router } from 'express';
import CryptosRouter from './Cryptos';
import HealthCheckRouter from './HealthCheck';
import AuthRouter from './Auth';
import UsersRouter from './Users';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/healthcheck', HealthCheckRouter);
router.use('/auth', AuthRouter);
router.use('/cryptos', CryptosRouter);
router.use('/users', UsersRouter);

// Export the base-router
export default router;
