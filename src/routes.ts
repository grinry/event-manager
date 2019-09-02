import { Router } from 'express';
import { Middleware } from '~app/middlewares/auth.middleware';
// import authorize = Middleware.authorize;

export const routes = Router();

routes.get('/status', (req, res) => res.send('OK'));
// routes.use(authorize).get('/authorized', (req, res) => res.send('OK'));
