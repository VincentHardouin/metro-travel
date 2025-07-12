import { computeSmallestStationsPath } from './graph.js';

function getRandomStations(stations) {
  return [
    stations[Math.floor(Math.random() * stations.length)],
    stations[Math.floor(Math.random() * stations.length)],
  ];
}

function getSeededRandomStations(seed) {
  const g = makeRandom(seed);
  return (stations) => {
    return [
      stations[g() % stations.length],
      stations[g() % stations.length],
    ];
  };
}

function makeRandom(seed) {
  seed %= 2147483647;
  if (seed <= 0)
    seed += 2147483646;
  const next = () => {
    seed = (seed * 48271) % 2147483647;
    return seed;
  };
  next();
  return next;
}

function pickStations({ stations, adjacentStops, random = getRandomStations, mode } = {}) {
  const MIN_DISTANCE = 5;

  let start = null;
  let end = null;
  let path = null;

  do {
    [start, end] = random(stations);
    path = computeSmallestStationsPath({ start: start.stop_unique_id, end: end.stop_unique_id, adjacentStops, mode });
  } while (path.distance < MIN_DISTANCE);

  return {
    start,
    end,
    ...path,
  };
}

export {
  getSeededRandomStations,
  pickStations,
};
