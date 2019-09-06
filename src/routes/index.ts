import { Router } from 'express';
import apiRoutes from './api';

const routes = Router();

routes.get('/status', (req, res) => res.send('OK'));
routes.use('/api', apiRoutes);

export default routes;
