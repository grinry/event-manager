import { Router } from 'express';
import { Middleware } from '~app/middlewares/auth.middleware';
import authorize = Middleware.authorize;

const routes = Router();

routes.route('/').get(authorize, (req, res) => {});
routes.route('/').post();
routes.route('/account').post();

export default routes;
