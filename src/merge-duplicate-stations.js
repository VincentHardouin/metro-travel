import fs from 'node:fs';

const metros = JSON.parse(fs.readFileSync('./assets/export.geojson'));

const stations = new Map()

metros.features
  .filter(d => {
    return d.properties.railway === 'stop' ||
      (d.properties.public_transport === 'stop_position' && (d.properties["type:RATP"] === 'metro' || d.properties.subway === 'yes'))
  }).forEach(s => {
  const properties = s.properties;
  const stationName = properties.name;

  const currentCoordinates = s.geometry.coordinates;
  const currentLine = s.properties['@relations']?.at(0)?.reltags.ref;

  if (stations.has(stationName)) {
    const station = stations.get(stationName);
    station.properties.coordinates.push(currentCoordinates);
    if (currentLine) station.properties.lines.add(currentLine)
  } else {
    s.properties.coordinates = [currentCoordinates];
    s.properties.lines = new Set();

    if (currentLine) s.properties.lines.add(currentLine);

    stations.set(stationName, s);
  }
});



const outputGeojson = {
  type: 'FeatureCollection',
  features: []
};

stations.forEach((s, key) => {
  s.properties.lines = Array.from(s.properties.lines);
  outputGeojson.features.push(s);
});

fs.writeFileSync('stations.geojson', JSON.stringify(outputGeojson, null, 2));
