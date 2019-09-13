import * as httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { APIError } from '~utils/APIError';
import { vars } from '~config/vars';
import fs from 'fs';
import path from 'path';
import { expressApp } from '~config/express-app';

const resolveErrorView = (code: number) => {
  if (fs.existsSync(path.resolve(expressApp.get('views'), `error_${code}.hbs`))) {
    return `error_${code}`;
  }
  return 'error';
};

export const errorHandler = (isApi: boolean = false) => (
  error: APIError,
  req: Request,
  res: Response,
  next?: NextFunction
) => {
  if (!error.status) {
    error.status = httpStatus.INTERNAL_SERVER_ERROR;
  }

  const errorResponse = {
    code: error.code,
    message: error.message || httpStatus[error.status],
    errors: error.errors,
    stack: error.stack,
  };

  if (vars.env === 'production') {
    delete errorResponse.stack;
  }

  res.status(error.status);
  if (isApi) {
    res.json(errorResponse);
    res.end();
  } else {
    res.render(resolveErrorView(error.status), errorResponse);
  }
};

export const errorConverter = (isApi: boolean) => (error: Error, req: Request, res: Response, next?: NextFunction) => {
  const convertedError: APIError = new APIError({
    message: error.message,
    status: httpStatus.INTERNAL_SERVER_ERROR,
    stack: error.stack,
  });
  //   if (err instanceof expressValidation.ValidationError) {
  //     convertedError = new APIError({
  //       message: 'Validation error.',
  //       errors: err.errors,
  //       status: err.status,
  //       stack: err.stack,
  //     });
  //   } else if

  // if (!(error instanceof APIError)) {
  //   convertedError = new APIError({
  //     message: error.message,
  //     status: httpStatus.INTERNAL_SERVER_ERROR,
  //     stack: error.stack
  //   });
  // }

  return errorHandler(isApi)(convertedError, req, res, next);
};

export const notFoundError = (isApi: boolean = false) => (req: Request, res: Response, next?: NextFunction) => {
  return errorHandler(isApi)(
    new APIError({
      message: 'Not found',
      status: httpStatus.NOT_FOUND,
      code: httpStatus.NOT_FOUND,
    }),
    req,
    res,
    next
  );
};
