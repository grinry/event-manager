import { Router } from 'express';
import auth from './auth.routes';

const routes = Router();

routes.get('/status', (req, res) =>
  res.json({
    status: 'ok',
  })
);
routes.use('/auth', auth);

export default routes;
