import express from 'express';
import * as bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import filter from 'content-filter';
import { errorConverter, errorHandler, notFoundError } from '~utils/error-handler';
import routes from '~routes';
import exphbs from 'express-handlebars';
import * as helpers from '../utils/helpers';
import * as path from 'path';
import cookieParser from 'cookie-parser';

let corsOptions = {};

if (process.env.CORS_ORIGIN) {
  corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
  };
}

export const expressApp = express();

expressApp.engine(
  '.hbs',
  exphbs({
    helpers: helpers,
    extname: '.hbs',

    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [path.resolve(__dirname, '..', 'resources', 'views', 'partials')],
  })
);
expressApp.set('view engine', '.hbs');
expressApp.set('views', path.resolve(__dirname, '..', 'resources', 'views'));

expressApp.use(express.static(path.resolve(__dirname, '..', 'public')));

// todo: try to find a way on how to serve static content when using ts-node for development.
if (process.env.NODE_ENV !== 'production') {
  expressApp.use(express.static(path.resolve(__dirname, '..', '..', 'dist', 'public')));
}

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(filter());
expressApp.use(cookieParser());

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
expressApp.use(errorConverter(false));

// catch 404 and forward to error handler
expressApp.use(notFoundError(false));

// error handler, send stacktrace only during development
expressApp.use(errorHandler(false));
