import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as url from 'node:url';
import { mergeDuplicateStations } from './merge-duplicate-stations.js';
import { extractLines } from './extract-lines.js';
import { addAdjacentStations } from './add-adjacent-stations.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export async function extractData() {
  const data = await _getData(join(__dirname, '../assets/export.geojson'));
  const mergedStations = mergeDuplicateStations({ data: { ...data } });
  const lines = extractLines({ data: { ...data } });
  const stations = addAdjacentStations({ linesData: { ...lines }, stationsData: { ...mergedStations } });
  await _writeData(join(__dirname, '../assets/stations.geojson'), stations);
  await _writeData(join(__dirname, '../assets/lines.geojson'), lines);
}

async function _getData(path) {
  const file = await readFile(path, 'utf-8');
  return JSON.parse(file);
}

async function _writeData(path, data) {
  await writeFile(path, JSON.stringify(data, null, 2));
}

extractData();
