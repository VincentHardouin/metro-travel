import process from 'node:process';
import * as url from 'node:url';
import { config } from 'dotenv';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

config({ path: `${__dirname}/../.env` });

function localPostgresEnv(databaseUrl, knexAsyncStacktraceEnabled) {
  return {
    client: 'postgresql',
    connection: databaseUrl,
    pool: {
      min: 1,
      max: 4,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
      stub: './migration-template.js',
      loadExtensions: ['.js'],
    },
    asyncStackTraces: knexAsyncStacktraceEnabled !== 'false',
  };
}

const environments = {
  development: localPostgresEnv(process.env.DATABASE_URL, process.env.KNEX_ASYNC_STACKTRACE_ENABLED),

  test: localPostgresEnv(process.env.TEST_DATABASE_URL, process.env.KNEX_ASYNC_STACKTRACE_ENABLED),

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: Number.parseInt(process.env.DATABASE_CONNECTION_POOL_MIN_SIZE, 10) || 1,
      max: Number.parseInt(process.env.DATABASE_CONNECTION_POOL_MAX_SIZE, 10) || 4,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
      loadExtensions: ['.js'],
    },
    asyncStackTraces: process.env.KNEX_ASYNC_STACKTRACE_ENABLED !== 'false',
  },
};

export default environments;
