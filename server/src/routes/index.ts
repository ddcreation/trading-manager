import { Router } from 'express';
import CryptosRouter from './Cryptos';
import HealthCheckRouter from './HealthCheck';
import AuthRouter from './Auth';
import UsersRouter from './Users';
import { authenticate } from '@middlewares/Auth';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/healthcheck', HealthCheckRouter);
router.use('/auth', AuthRouter);
router.use('/cryptos', authenticate, CryptosRouter);
router.use('/users', authenticate, UsersRouter);

// Export the base-router
export default router;
