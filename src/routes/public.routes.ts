import { Router } from 'express';
import { PublicController } from '~app/http/controllers/public/auth.controller';

const routes = Router();
const auth = new PublicController.AuthController();

routes.get('/', function(req, res) {
  // console.log(req.cookies);
  res.render('home', {
    title: 'Home',
  });
});
routes.get('/login', auth.login);
routes.get('/register', auth.register);
routes.get('/account', auth.account);

export default routes;
