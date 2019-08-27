import { config } from '~config';
import { sequelize } from '~app/connection';
import { app } from 'app';
import './process-handler';

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to database.');
    app.listen(config.port, () => {
      console.log('Server is started on port ', config.port);
    });
  })
  .catch(e => {
    console.error('Unable to connect to database.');
    console.error(e);
    process.exit(1);
  });
