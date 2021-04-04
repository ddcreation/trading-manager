import { Router } from 'express';
import CryptosRouter from './Cryptos';
import HealthCheckRouter from './HealthCheck';
import UserRouter from './Users';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/healthcheck', HealthCheckRouter);
router.use('/cryptos', CryptosRouter);
router.use('/users', UserRouter);

// Export the base-router
export default router;
