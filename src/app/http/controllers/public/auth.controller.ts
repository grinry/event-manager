import { NextFunction, Request, Response } from 'express';

export namespace PublicController {
  export class AuthController {
    public login(req: Request, res: Response, next: NextFunction) {
      return res.render('pages/login');
    }
    public register(req: Request, res: Response, next: NextFunction) {
      return res.render('pages/register');
    }
    public account(req: Request, res: Response, next: NextFunction) {
      return res.render('pages/account');
    }
  }
  export const authController = new AuthController();
}
