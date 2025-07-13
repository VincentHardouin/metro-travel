import { adjacentStops, routes, stops, uniqueStops } from '~~/assets/data.json';

function getAdjacentStops() {
  return adjacentStops;
}

function getUniqueStops() {
  return uniqueStops;
}

function getRoutes() {
  return routes;
}

function getStops() {
  return stops;
}

export {
  getAdjacentStops,
  getRoutes,
  getStops,
  getUniqueStops,
};
