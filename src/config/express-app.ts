import express from 'express';
import * as bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import filter from 'content-filter';
import {
  errorConverter,
  errorHandler,
  notFoundError,
} from '~app/utils/error-handler';
import routes from '~app/routes';

let corsOptions = {};

if (process.env.CORS_ORIGIN) {
  corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
  };
}

export const expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(filter());

// gzip compression
expressApp.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
expressApp.use(methodOverride());

// secure apps by setting various HTTP headers
expressApp.use(helmet());

// enable CORS - Cross Origin Resource Sharing
expressApp.use(cors(corsOptions));

// mount api v1 routes
expressApp.use('/', routes);

// if error is not an instanceOf APIError, convert it.
expressApp.use(errorConverter);

// catch 404 and forward to error handler
expressApp.use(notFoundError);

// error handler, send stacktrace only during development
expressApp.use(errorHandler);

