import fs from 'node:fs';

const metros = JSON.parse(fs.readFileSync('./assets/export.geojson'));

const stations = new Map()

metros.features
  .filter(d => {
    return d.properties.railway === 'stop' ||
      (d.properties.public_transport === 'stop_position' && d.properties["type:RATP"] === 'metro')
  }).forEach(s => {
  const properties = s.properties;
  const stationName = properties.name;

  if (stations.has(stationName)) {
    const station = stations.get(stationName);
    station.properties.coordinates.push(s.geometry.coordinates);
  } else {
    s.properties.coordinates = [s.geometry.coordinates];
    stations.set(stationName, s);
  }
});



const outputGeojson = {
  type: 'FeatureCollection',
  features: []
};

stations.forEach((s, key) => {
  outputGeojson.features.push(s);
});


fs.writeFileSync('station_connections.geojson', JSON.stringify(outputGeojson, null, 2));
