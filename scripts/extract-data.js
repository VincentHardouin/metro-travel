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
  const reducedStations = keepNeededStationMetadata({ data: { ...stations } });
  const reducedLines = keepNeededLineMetadata({ data: { ...lines } });
  await _writeData(join(__dirname, '../assets/stations.geojson'), reducedStations);
  await _writeData(join(__dirname, '../assets/lines.geojson'), reducedLines);
}

function keepNeededLineMetadata({ data }) {
  const keepProperties = ({ name, ref, from, to, color }) => ({ name, ref, from, to, color });
  return {
    type: 'FeatureCollection',
    features: data.features.map((f) => {
      return {
        type: 'Feature',
        properties: keepProperties(f.properties),
        geometry: f.geometry,
      };
    }),
  };
}

function keepNeededStationMetadata({ data }) {
  const keepProperties = ({ name, coordinates, lines, inLineIndex, adjacentStations }) => ({ name, coordinates, lines, inLineIndex, adjacentStations });
  return {
    type: 'FeatureCollection',
    features: data.features.map((f) => {
      return {
        geometry: f.geometry,
        properties: keepProperties(f.properties),
        type: 'Feature',
      };
    }),
  };
}

async function _getData(path) {
  const file = await readFile(path, 'utf-8');
  return JSON.parse(file);
}

async function _writeData(path, data) {
  await writeFile(path, JSON.stringify(data, null, 2));
}

extractData();
