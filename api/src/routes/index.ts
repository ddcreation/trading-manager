import { Router } from 'express';
import HealthCheckRouter from './HealthCheck';
// import UserRouter from './Users';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/healthcheck', HealthCheckRouter);
// router.use('/users', UserRouter);

// Export the base-router
export default router;
