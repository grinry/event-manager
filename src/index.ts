import { config } from '~config';
import { sequelize } from '~app/connection';
import { app } from 'app';
import './process-handler';
// import { createAccount } from '~app/services/auth.service';
import User from '~app/models/user.model';
import Event from '~app/models/event.model';

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to database.');
    app.listen(config.port, async () => {
      console.log('Server is started on port ', config.port);

      // const user1 = await createAccount('rytis+3@edgeless.io', 'secret', 'Rytis');
      // await createAccount('rytis+4@edgeless.io', 'secret', 'Rytis', user1.id);
      const user = await User.findByPk(7);
      console.log(user);

      user.events.push(
        new Event({
          name: 'Best event',
          slug: 'thats is a Best event here!',
        })
      );
    });
  })
  .catch(e => {
    console.error('Unable to connect to database.');
    console.error(e);
    process.exit(1);
  });
