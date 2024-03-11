export function mergeDuplicateStations({ data }) {
  const stations = new Map();

  const metros = data.features
    .filter((d) => {
      return d.properties.railway === 'stop'
        || (d.properties.public_transport === 'stop_position' && (d.properties['type:RATP'] === 'metro' || d.properties.subway === 'yes'));
    });

  for (const s of metros) {
    const properties = s.properties;
    const stationName = properties.name;

    const currentCoordinates = s.geometry.coordinates;

    const relations = s.properties['@relations'];

    if (!relations)
      continue;

    relations.forEach((relation) => {
      const currentLine = relation.reltags.name;

      if (stations.has(stationName)) {
        const station = stations.get(stationName);
        station.properties.coordinates.set(JSON.stringify(currentCoordinates), currentCoordinates);
        if (currentLine)
          station.properties.lines.add(currentLine);
      }
      else {
        s.properties.coordinates = new Map();
        s.properties.coordinates.set(JSON.stringify(currentCoordinates), currentCoordinates);
        s.properties.lines = new Set();
        if (currentLine)
          s.properties.lines.add(currentLine);

        stations.set(stationName, s);
      }
    });
  }

  const outputGeojson = {
    type: 'FeatureCollection',
    features: [],
  };

  stations.forEach((s) => {
    s.properties.lines = Array.from(s.properties.lines);
    s.properties.coordinates = Array.from(s.properties.coordinates.values());
    outputGeojson.features.push(s);
  });

  return outputGeojson;
}
