export function addAdjacentStations({ linesData, stationsData }) {
  const lines = linesData.features;
  const stations = stationsData.features;

  lines.forEach((line) => {
    const lineName = line.properties.name;
    const lineStations = stations.filter((station) => {
      return station.properties.lines.includes(lineName);
    });

    const lineCoordinates = line.geometry.type === 'LineString' ? line.geometry.coordinates : line.geometry.coordinates[0];

    lineCoordinates.forEach((coordinates, index) => {
      const station = lineStations.find((s) => {
        return s.properties.coordinates.find((c) => {
          return c[0] === coordinates[0] && c[1] === coordinates[1];
        });
      });

      if (station)
        _addInLineIndex(station, lineName, index);
    });

    const sortedStations = lineStations.filter((s) => {
      return s.properties.inLineIndex;
    }).sort((a, b) => {
      return a.properties.inLineIndex[lineName] - b.properties.inLineIndex[lineName];
    });

    sortedStations.forEach((station, index) => {
      if (index < sortedStations.length - 1) {
        const nextStation = sortedStations[index + 1];
        _addAdjacentStations(station, lineName, nextStation.properties.name);
      }

      if (index > 0) {
        const previousStation = sortedStations[index - 1];
        _addAdjacentStations(station, lineName, previousStation.properties.name);
      }
    });
  });

  stations.forEach((station) => {
    if (!station.properties.adjacentStations)

      console.log('Station is missing adjacentStations', station.properties.name);

    if (station.properties.adjacentStations) {
      const adjacentStations = {};
      Object.keys(station.properties.adjacentStations).forEach((lineName) => {
        adjacentStations[lineName] = Array.from(station.properties.adjacentStations[lineName]);
      });
      station.properties.adjacentStations = adjacentStations;
    }
  });

  const outputGeojson = {
    type: 'FeatureCollection',
    features: [],
  };

  stations.forEach((s) => {
    outputGeojson.features.push(s);
  });

  return outputGeojson;
}

function _addInLineIndex(station, lineName, index) {
  station.properties.inLineIndex = station.properties.inLineIndex || {};
  if (!station.properties.inLineIndex[lineName])
    station.properties.inLineIndex[lineName] = index;
}

function _addAdjacentStations(station, lineName, stationName) {
  station.properties.adjacentStations = station.properties.adjacentStations || {};
  if (station.properties.adjacentStations[lineName]) {
    station.properties.adjacentStations[lineName].add(stationName);
  }
  else {
    station.properties.adjacentStations[lineName] = new Set();
    station.properties.adjacentStations[lineName].add(stationName);
  }
}
