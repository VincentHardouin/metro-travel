import fs from 'node:fs';

const linesData = JSON.parse(fs.readFileSync('./assets/lines.geojson'));
const stationsData = JSON.parse(fs.readFileSync('./assets/stations.geojson'))

const lines = linesData.features;
const stations = stationsData.features;

lines.forEach((line) => {
  const lineName = line.properties.ref;
  const lineStations = stations.filter((station) => {
    return station.properties.lines.includes(lineName);
  });

  const lineCoordinates = line.geometry.type === 'LineString' ? line.geometry.coordinates : line.geometry.coordinates[0]

  lineCoordinates.forEach((coordinates, index) => {
    const station = lineStations.find((s) => {
      return s.properties.coordinates.find((c) => {
        return c[0] === coordinates[0] && c[1] === coordinates[1];
      });
    });

    if (station) {
      if (station.properties.inLineIndex) {
        station.properties.inLineIndex[lineName] = index;
      } else {
        station.properties.inLineIndex = {
          [lineName]: index
        };
      }
    }
  });
});

for (const station of stations) {
  const stationName = station.properties.name;

  if (!station.properties.inLineIndex) {
    console.log(`Station ${stationName} is not on any line`);
    continue;
  }

  Object.keys(station.properties.inLineIndex).forEach((lineName) => {
    const lineIndex = station.properties.inLineIndex[lineName];

    const nextStation = stations.find((s) => {
      return s.properties.lines.includes(lineName) && s.properties.inLineIndex && s.properties.inLineIndex[lineName] === lineIndex + 1;
    });
    const previousStation = stations.find((s) => {
      return s.properties.lines.includes(lineName) && s.properties.inLineIndex && s.properties.inLineIndex[lineName] === lineIndex - 1;
    });

    if (nextStation) {
      if (station.properties.adjacentStations) {
        station.properties.adjacentStations[lineName].push(nextStation.properties.name);
      } else {
        station.properties.adjacentStations = {
          [lineName]: [nextStation.properties.name]
        }
      }
    }

    if (previousStation) {
      if (station.properties.adjacentStations) {
        station.properties.adjacentStations[lineName].push(previousStation.properties.name);
      } else {
        station.properties.adjacentStations = {
          [lineName]: [previousStation.properties.name]
        };
      }
    }
  });
}

fs.writeFileSync('stations.geojson', JSON.stringify(stations, null, 2));