import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { verify } from 'jsonwebtoken';
import { HttpStatusError } from '~utils/APIError';
import { vars } from '~config/vars';

export module Middleware {
  /**
   * Allows only authorized actor to access resource.
   * @param req
   * @param res
   * @param next
   */
  export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const decoded: any = await verify(req.get('Authorization'), vars.jwt.secret);
      req.userId = decoded.sub;
      req.user = {};
      return next();
    } catch (e) {
      return next(new HttpStatusError(httpStatus.UNAUTHORIZED));
    }
  };
}
