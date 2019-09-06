import * as httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { APIError } from '~app/utils/APIError';
import { vars } from '~config/vars';

export const errorHandler = (error: APIError, req: Request, res: Response, next?: NextFunction) => {
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
  res.json(errorResponse);
  res.end();
};

export const errorConverter = (error: Error, req: Request, res: Response, next?: NextFunction) => {
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

  return errorHandler(convertedError, req, res, next);
};

export const notFoundError = (req: Request, res: Response, next?: NextFunction) => {
  return errorHandler(
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
