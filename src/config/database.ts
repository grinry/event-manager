import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { vars } from '~config/vars';

const options: SequelizeOptions = {
  ...vars.database.options,
  ...{
    modelPaths: [`${__dirname}/models`],
  },
};

export const sequelize = new Sequelize(vars.database.uri, options);
sequelize.authenticate().then(() => {
  sequelize.sync({ force: false, alter: true });
});
