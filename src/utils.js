import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getStations() {
  const stationsPath = join(__dirname, '../assets/stations.geojson');
  const { features: stations } = JSON.parse(fs.readFileSync(stationsPath));
  return stations.filter((s) => {
    return s.properties.adjacentStations && s.properties.name;
  });
}

export {
  getStations,
};
