import { resolve } from 'path';
import { config as load } from 'dotenv';

load({ path: resolve(__dirname, '../.env') });

export const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 8888,
  salt: process.env.BCRYPT_SALT || 0,
  jwt: {
    secret: process.env.JWT_SECRET,
    expireAfterMinutes: 20,
  },
  database: {
    dialect: process.env.DATABASE_DIALECT,
    uri: process.env.DATABASE_URI,
    options: {
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    },
  },
};