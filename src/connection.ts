import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { config } from "~config";

const options: SequelizeOptions = {
  ...config.database.options,
  ...{
    modelPaths: [`${__dirname}/models`]
  }
};

export const sequelize = new Sequelize(config.database.uri, options);

// sequelize.sync();
