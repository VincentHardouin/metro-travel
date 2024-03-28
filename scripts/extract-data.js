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

async function getAdjacentStations() {
  const adjacentStations = await knex
    .with('stop_with_adjacent_station', knex
      .distinct(
        'st.stop_id as from_stop_id',
        'adjacent_stops.stop_id as to_stop_id',
        knex.raw(`CASE
            WHEN st.arrival_time::interval <= adjacent_stops.arrival_time::interval
                 THEN (adjacent_stops.arrival_time::interval - st.arrival_time::interval)::TEXT
             ELSE (st.arrival_time::interval - adjacent_stops.arrival_time::interval)::TEXT
            END AS duration`),
      )
      .from('stop_times as st')
      .join('stop_times as adjacent_stops', 'st.trip_id', 'adjacent_stops.trip_id')
      .join('trips as t', 'st.trip_id', 't.trip_id')
      .join('routes as r', 't.route_id', 'r.route_id')
      .whereRaw('ABS(st.stop_sequence - adjacent_stops.stop_sequence) = 1')
      .andWhere('r.route_type', 1)).select('from_stop_id', 'to_stop_id', knex.min('duration').as('time')).from('stop_with_adjacent_station').groupBy('from_stop_id', 'to_stop_id');
  return adjacentStations;
}

export { getRoutes, getStops, getAdjacentStations };
