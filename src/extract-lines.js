import fs from 'node:fs';

const metros = JSON.parse(fs.readFileSync('./assets/export.geojson'));

const lines = metros.features.filter((d) => {
  return d.geometry.type === 'MultiLineString' || (d.geometry.type === 'LineString' && d.properties.route === 'subway');
})

const lineString = metros.features.filter((d) => d.geometry.type === 'LineString' && d.properties.route === 'subway');
console.log(lineString.at(1));

console.log(lines.sort((a, b) => a.properties.name.localeCompare(b.properties.name)).map(d => d.properties.name));

