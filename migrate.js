const path = require('path');
// const child_process = require('child_process');
const Promise = require('bluebird');
const Sequelize = require('sequelize');
const Umzug = require('umzug');
const { config } = require('dotenv');
const { resolve } = require('path');

config({ path: resolve(__dirname, ".env") });

// const DB_NAME = 'sequelize_migration_demo';
// const DB_USER = 'sequelize_demo_admin';

const sequelize = new Sequelize(process.env.DATABASE_URI, {
  dialect: process.env.DATABASE_DIALECT,

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
  },

  // see: https://github.com/sequelize/umzug/issues/17
  migrations: {
    params: [
      sequelize.getQueryInterface(), // queryInterface
      sequelize.constructor, // DataTypes
      function() {
        throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
      }
    ],
    path: './migrations',
    pattern: /\.js$/
  },

  logging: function() {
    console.log.apply(null, arguments);
  },
});

function logUmzugEvent(eventName) {
  return function(name, migration) {
    console.log(`${ name } ${ eventName }`);
  }
}
umzug.on('migrating', logUmzugEvent('migrating'));
umzug.on('migrated',  logUmzugEvent('migrated'));
umzug.on('reverting', logUmzugEvent('reverting'));
umzug.on('reverted',  logUmzugEvent('reverted'));

function cmdStatus() {
  let result = {};

  return umzug.executed()
    .then(executed => {
      result.executed = executed;
      return umzug.pending();
    }).then(pending => {
      result.pending = pending;
      return result;
    }).then(({ executed, pending }) => {

      executed = executed.map(m => {
        m.name = path.basename(m.file, '.js');
        return m;
      });
      pending = pending.map(m => {
        m.name = path.basename(m.file, '.js');
        return m;
      });

      const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
      const status = {
        current: current,
        executed: executed.map(m => m.file),
        pending: pending.map(m => m.file),
      };

      console.log(JSON.stringify(status, null, 2));

      return { executed, pending };
    })
}

function cmdMigrate() {
  return umzug.up();
}

function cmdMigrateNext() {
  return cmdStatus()
    .then(({ executed, pending }) => {
      if (pending.length === 0) {
        return Promise.reject(new Error('No pending migrations'));
      }
      const next = pending[0].name;
      return umzug.up({ to: next });
    })
}

function cmdReset() {
  return umzug.down({ to: 0 });
}

function cmdResetPrev() {
  return cmdStatus()
    .then(({ executed, pending }) => {
      if (executed.length === 0) {
        return Promise.reject(new Error('Already at initial state'));
      }
      const prev = executed[executed.length - 1].name;
      return umzug.down({ to: prev });
    })
}

// function cmdHardReset() {
//   return new Promise((resolve, reject) => {
//     setImmediate(() => {
//       try {
//         console.log(`dropdb ${ DB_NAME }`);
//         child_process.spawnSync(`dropdb ${ DB_NAME }`);
//         console.log(`createdb ${ DB_NAME } --username ${ DB_USER }`);
//         child_process.spawnSync(`createdb ${ DB_NAME } --username ${ DB_USER }`);
//         resolve();
//       } catch (e) {
//         console.log(e);
//         reject(e);
//       }
//     });
//   });
// }

function cmdHelp() {
  return new Promise((resolve) => {
    console.log('help             shows this list of commands');
    console.log('status           print current migration status');
    console.log('up               executed all unexecuted migrations');
    console.log('down             revert all executed migrations');
    console.log('next             execute the next pending migration');
    console.log('prev             revert the previous executed migration');
    // console.log('hard-reset       Resets database by deleting and recreating it.');
    resolve();
  });
}

const args = process.argv.slice(2).map(e => e.trim().toLowerCase());
const cmd = args.length > 0 ? args[0] : 'help';
let executedCmd;

console.log(`${ cmd.toUpperCase() } BEGIN`);
switch(cmd) {
  case 'help':
    executedCmd = cmdHelp();
    break;

  case 'status':
    executedCmd = cmdStatus();
    break;

  case 'up':
    executedCmd = cmdMigrate();
    break;

  case 'next':
    executedCmd = cmdMigrateNext();
    break;

  case 'down':
    executedCmd = cmdReset();
    break;

  case 'prev':
    executedCmd = cmdResetPrev();
    break;

  // case 'reset-hard':
  //   executedCmd = cmdHardReset();
  //   break;

  default:
    console.log(`invalid cmd: ${ cmd }`);
    process.exit(1);
}

executedCmd
  .then((result) => {
    const doneStr = `${ cmd.toUpperCase() } DONE`;
    console.log(doneStr);
    console.log("=".repeat(doneStr.length));
  })
  .catch(err => {
    const errorStr = `${ cmd.toUpperCase() } ERROR`;
    console.log(errorStr);
    console.log("=".repeat(errorStr.length));
    console.log(err);
    console.log("=".repeat(errorStr.length));
  })
  .then(() => {
    return Promise.resolve();
  })
  .then(() => process.exit(0));
