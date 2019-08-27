import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { verify } from 'jsonwebtoken';
import { APIError } from '~app/utils/APIError';
import { config } from '~config';

const unauthorized = new APIError({
  message: httpStatus[httpStatus.UNAUTHORIZED],
  status: httpStatus.UNAUTHORIZED,
});

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decoded: any = await verify(req.get('Authorization'), config.jwt.secret);
    req.userId = decoded.sub;
    req.user = {};
    return next();
  } catch (e) {
    return next(unauthorized);
  }
};
