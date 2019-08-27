import * as httpStatus from 'http-status';

export interface ErrorData {
  message: string;
  status: number;
  code?: number;
  errors?: Error[];
  isPublic?: boolean;
  stack?: string;
}

export class ExtendableError extends Error {
  public errors: Error[] = [];
  public status: number = httpStatus.INTERNAL_SERVER_ERROR;
  public isPublic: boolean = false;
  public code: number;

  constructor({
    message,
    errors,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic = false,
    stack = null,
    code = null,
  }: ErrorData) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.stack = stack;
    this.code = code;
    // @ts-ignore
    Error.captureStackTrace(this, this.constructor.name);
  }
}

export class APIError extends ExtendableError {
  constructor({
    message,
    errors,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic = false,
    stack = null,
    code = null,
  }: ErrorData) {
    super({ message, errors, status, isPublic, stack, code });
  }
}
