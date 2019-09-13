import { resolve } from 'path';
import { config as load } from 'dotenv';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import path from 'path';

load({ path: resolve(__dirname, '../.env') });

const options: SequelizeOptions = {
  logging: false,
  modelPaths: [path.resolve(__dirname, '..', 'src', 'app', 'models')],
};

const sequelize = new Sequelize(process.env.DATABASE_TEST_URI, options);

export async function openDatabase() {
  await sequelize.authenticate();
  return await sequelize.sync({ force: true });
}

export async function clearDatabase() {
  await sequelize.dropAllSchemas({});
}
