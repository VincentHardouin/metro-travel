export function extractLines({ data }) {
  const lines = data.features.filter((d) => {
    return d.geometry.type === 'MultiLineString' || (d.geometry.type === 'LineString' && d.properties.route === 'subway');
  });

  const outputGeojson = {
    type: 'FeatureCollection',
    features: [],
  };

  lines.forEach((l) => {
    outputGeojson.features.push(l);
  });

  return outputGeojson;
}
