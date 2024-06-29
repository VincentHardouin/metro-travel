import process from 'node:process';
import { access, constants } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import * as url from 'node:url';
import * as path from 'node:path';
import { disconnect } from '../db/knex-database-connection.js';
import { parseDataStream } from './parse-data.js';
import { savePathways, saveRoutes, saveStopTimes, saveStops, saveTransfers, saveTrips } from './save-data.js';

async function main(dirPath) {
  if (!dirPath)
    throw new Error('You must provide a path to the data directory.');

  await _verifyPath(dirPath);
  console.log(`Importing data from ${dirPath}`);

  await importData(dirPath, 'routes', saveRoutes);
  await importData(dirPath, 'pathways', savePathways);
  await importData(dirPath, 'trips', saveTrips);
  await importData(dirPath, 'stop_times', saveStopTimes);
  await importData(dirPath, 'stops', saveStops);
  await importData(dirPath, 'transfers', saveTransfers);
}

async function importData(dirPath, dataName, saveFunction) {
  console.log(`Parsing ${dataName}...`);
  const dataString = await getFile(dirPath, `${dataName}.txt`);
  const stream = parseDataStream(dataString);
  let chunks = [];
  for await (const data of stream) {
    chunks.push(data);
    if (chunks.length > 1000) {
      await saveFunction(chunks);
      chunks = [];
    }
  }
  await saveFunction(chunks);

  console.log(`${dataName} saved`);
}

async function _verifyPath(dirPath) {
  try {
    await access(path.resolve(dirPath), constants.R_OK);
  }
  catch (e) {
    throw new Error(`The path ${dirPath} is not accessible.`);
  }
}

async function getFile(dirPath, fileName) {
  const filePath = path.join(dirPath, fileName);
  await _verifyPath(filePath);
  return createReadStream(filePath, 'utf8');
}

const modulePath = url.fileURLToPath(import.meta.url);
const isLaunchedFromCommandLine = process.argv[1] === modulePath;

(async () => {
  if (isLaunchedFromCommandLine) {
    try {
      await main(process.argv[2]);
    }
    catch (error) {
      console.error(error);
      process.exitCode = 1;
    }
    finally {
      await disconnect();
    }
  }
})();

export { importData };
