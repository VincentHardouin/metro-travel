import fs from 'node:fs';

export function extractLines({ inputPath = './assets/export.geojson', outputPath = 'lines.geojson' }) {
  const metros = JSON.parse(fs.readFileSync(inputPath));

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

  fs.writeFileSync(outputPath, JSON.stringify(outputGeojson, null, 2));
}
