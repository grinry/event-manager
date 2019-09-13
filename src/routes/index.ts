import { Router } from 'express';
import publicRoutes from './public.routes';
import apiRoutes from './api.routes';
import { errorConverter, errorHandler, notFoundError } from '~utils/error-handler';

const routes = Router();

routes.get('/status', (req, res) => res.send('OK'));
routes.use(publicRoutes);
routes.use('/api', errorConverter(true), notFoundError(true), errorHandler(true), apiRoutes);

export default routes;
