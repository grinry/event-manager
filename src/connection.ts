import { Sequelize } from "sequelize-typescript";
import { config } from "~config";

export const sequelize = new Sequelize(
  config.database.uri,
  config.database.options
);
