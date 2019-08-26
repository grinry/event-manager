import { resolve } from "path";
import { config as load } from "dotenv";

load({ path: resolve(__dirname, "../.env") });

export const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 8888,
  jwt: {
    secret: process.env.JWT_SECRET
  },
  database: {
    dialect: process.env.DATABASE_DIALECT,
    uri: process.env.DATABASE_URI,
    options: {
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  }
};
