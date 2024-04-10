import { disconnect, emptyAllTables } from '../../db/knex-database-connection.js';

async function main() {
  console.info('Emptying all tables...');
  await emptyAllTables();
  console.info('Done!');
}

(async () => {
  try {
    await main();
  }
  catch (error) {
    console.error(error);
    // eslint-disable-next-line node/prefer-global/process
    process.exitCode = 1;
  }
  finally {
    await disconnect();
  }
})();
