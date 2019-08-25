import express from "express";
import * as bodyParser from "body-parser";
import compress from "compression";
import methodOverride from "method-override";
import cors from "cors";
import helmet from "helmet";
import filter from "content-filter";
import {
  errorConverter,
  errorHandler,
  notFoundError
} from "~app/utils/error-handler";
import { config } from "~config";
import { routes } from "~app/routes";

let corsOptions = {};

if (process.env.CORS_ORIGIN) {
  corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200
  };
}

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(filter());

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors(corsOptions));

// mount api v1 routes
app.use("/", routes);

// if error is not an instanceOf APIError, convert it.
app.use(errorConverter);

// catch 404 and forward to error handler
app.use(notFoundError);

// error handler, send stacktrace only during development
app.use(errorHandler);

app.listen(config.port, () => {
  console.log("Server is started on ", config.port);
});
