import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { vars } from '~config/vars';
import path from 'path';

const options: SequelizeOptions = {
  ...vars.database.options,
  ...{
    modelPaths: [path.resolve(__dirname, '..', 'app', 'models')],
  },
};

console.log(path.resolve(__dirname, '..', 'app', 'models'));

export const sequelize = new Sequelize(vars.database.uri, options);
sequelize.authenticate().then(() => {
  sequelize.sync({ force: false, alter: true });
});
