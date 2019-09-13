/// <reference path="./custom.d.ts" />
import { vars } from '~config/vars';
import { sequelize } from '~config/database';
import { expressApp } from '~config/express-app';
import './process-handler';

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to database.');
    expressApp.listen(vars.port, async () => {
      console.log('Server is started on port ', vars.port);

      // const user1 = await createAccount('rytis+3@edgeless.io', 'secret', 'Rytis');
      // await createAccount('rytis+4@edgeless.io', 'secret', 'Rytis', user1.id);
      // const user = await User.findByPk(7);
      // console.log(user);
      //
      // user.events.push(
      //   new Event({
      //     name: 'Best event',
      //     slug: 'thats is a Best event here!',
      //   })
      // );
    });
  })
  .catch(e => {
    console.error('Unable to connect to database.');
    console.error(e);
    process.exit(1);
  });
