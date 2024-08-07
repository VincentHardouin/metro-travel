import 'dotenv/config';
import process from 'node:process';
import { PGSQL_DUPLICATE_DATABASE_ERROR } from '../../db/pgsql-errors.js';
import { PgClient } from '../PgClient.js';

const dbUrl = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

const url = new URL(dbUrl);

const DB_TO_CREATE_NAME = url.pathname.slice(1);

url.pathname = '/postgres';

PgClient.getClient(url.href).then(async (client) => {
  try {
    await client.query_and_log(`CREATE DATABASE ${DB_TO_CREATE_NAME};`);
    console.info('Database created');
    await client.end();
  }
  catch (error) {
    if (error.code === PGSQL_DUPLICATE_DATABASE_ERROR)
      console.info(`Database ${DB_TO_CREATE_NAME} already created`);
    else
      console.error(`Database creation failed: ${error.detail}`);
  }
  finally {
    await client.end();
  }
});
