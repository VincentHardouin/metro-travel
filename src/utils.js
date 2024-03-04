import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

let __dirname = dirname(fileURLToPath(import.meta.url));

function getStations() {
  const stationsPath = join(__dirname, '../assets/stations.geojson');
  const { features: stations } = JSON.parse(fs.readFileSync(stationsPath));
  return stations.filter((s) => {
    return s.properties.adjacentStations && s.properties.name;
  });
}

function stationExists(stations, stationName) {
  return stations.some((station) => {
    return station.properties.name === stationName;
  });
}

export {
  getStations,
  stationExists,
}