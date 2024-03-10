import fs from 'node:fs';

const metros = JSON.parse(fs.readFileSync('./assets/export.geojson'));

const lines = metros.features.filter((d) => {
  return d.geometry.type === 'MultiLineString' || (d.geometry.type === 'LineString' && d.properties.route === 'subway');
});

const outputGeojson = {
  type: 'FeatureCollection',
  features: [],
};

lines.forEach((l) => {
  outputGeojson.features.push(l);
});

fs.writeFileSync('lines.geojson', JSON.stringify(outputGeojson, null, 2));
