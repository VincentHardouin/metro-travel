import 'dotenv/config';
import process from 'node:process';
import { PGSQL_NON_EXISTENT_DATABASE_ERROR } from '../../db/pgsql-errors.js';
import { PgClient } from '../PgClient.js';

function isPlatformScalingo() {
  return Boolean(process.env.CONTAINER);
}

function preventDatabaseDropAsItCannotBeCreatedAgain() {
  if (isPlatformScalingo()) {
    console.error('Database will not be dropped, as it would require to recreate the addon');
    process.exitCode = 1;
  }
}

preventDatabaseDropAsItCannotBeCreatedAgain();

const dbUrl = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

const url = new URL(dbUrl);

const DB_TO_DELETE_NAME = url.pathname.slice(1);

url.pathname = '/postgres';

PgClient.getClient(url.href).then(async (client) => {
  try {
    const WITH_FORCE = _withForceOption();
    await client.query_and_log(`DROP DATABASE ${DB_TO_DELETE_NAME}${WITH_FORCE};`);
    console.info('Database dropped');
    await client.end();
  }
  catch (error) {
    if (error.code === PGSQL_NON_EXISTENT_DATABASE_ERROR)
      console.info(`Database ${DB_TO_DELETE_NAME} does not exist`);
    else
      console.error(`Database drop failed: ${error.detail}`);
  }
  finally {
    await client.end();
  }
});

function _withForceOption() {
  return process.env.FORCE_DROP_DATABASE === 'true' ? ' WITH (FORCE)' : '';
}
