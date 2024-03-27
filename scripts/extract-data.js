import { knex } from '../db/knex-database-connection.js';

async function getRoutes() {
  const routes = await knex('routes').select('*').where('route_type', 1);
  return routes.map((route) => {
    return {
      route_id: route.route_id,
      route_name: route.route_short_name,
      route_color: route.route_color,
      route_text_color: route.route_text_color,
    };
  });
}

async function getStops() {
  const stops = await knex('stops').distinct('stops.stop_id', 'stops.stop_name', 'stops.stop_lat', 'stops.stop_lon', 'routes.route_id')
    .join('stop_times', 'stops.stop_id', 'stop_times.stop_id')
    .join('trips', 'stop_times.trip_id', 'trips.trip_id')
    .join('routes', 'trips.route_id', 'routes.route_id')
    .where('routes.route_type', 1);
  return stops.map((stop) => {
    return {
      stop_id: stop.stop_id,
      stop_name: stop.stop_name,
      stop_lat: stop.stop_lat,
      stop_lon: stop.stop_lon,
      route_id: stop.route_id,
    };
  });
}

export { getRoutes, getStops };
