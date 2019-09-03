declare namespace Express {
  export interface Request {
    userId?: string;
    user?: any;
  }
}

declare namespace NodeJS {
  interface Global {
    __rootdir__: string;
  }
}
