import { sequelize } from '~config/database';

process.on('exit', async e => {
  console.log('about to exit', e);
  await sequelize.close();
});

process.on('SIGINT', async () => {
  console.log('exiting.');
  process.exit(0);
});
