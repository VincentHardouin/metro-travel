import {adjacentStops, routes, stops, uniqueStops} from '~~/assets/data';

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
  getUniqueStops,
  getStops,
};
