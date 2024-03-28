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
  return knex.with('stop_ids', (qb) => {
    qb.select('stop_id', 'routes.route_short_name')
      .distinct()
      .from('stop_times')
      .join('trips', 'stop_times.trip_id', '=', 'trips.trip_id')
      .join('routes', 'trips.route_id', '=', 'routes.route_id')
      .where('routes.route_type', 1);
  })
    .with('adjacent_stops_in_transfers', (qb) => {
      qb.select('from_stop_id', 'to_stop_id', 'min_transfer_time as duration')
        .distinct()
        .from('transfers')
        .join('stop_ids as fs', 'fs.stop_id', '=', 'transfers.from_stop_id')
        .join('stop_ids as ts', 'ts.stop_id', '=', 'transfers.to_stop_id');
    })
    .with('adjacent_stops_by_routes', (qb) => {
      qb.select('st.stop_id as from_stop_id', 'adjacent_stops.stop_id as to_stop_id')
        .distinct()
        .select(knex.raw(`CASE
      WHEN st.arrival_time::interval <= adjacent_stops.arrival_time::interval
        THEN EXTRACT(epoch from (adjacent_stops.arrival_time::interval - st.arrival_time::interval))::int
      ELSE EXTRACT(epoch from (st.arrival_time::interval - adjacent_stops.arrival_time::interval))::int
      END as duration`))
        .from('stop_times as st')
        .join('stop_times as adjacent_stops', 'st.trip_id', '=', 'adjacent_stops.trip_id')
        .join('stop_ids as fs', 'st.stop_id', '=', 'fs.stop_id')
        .join('stop_ids as ts', 'adjacent_stops.stop_id', '=', 'ts.stop_id')
        .whereRaw('ABS(st.stop_sequence - adjacent_stops.stop_sequence) = 1');
    })
    .with('adjacent_stops', (qb) => {
      qb.select('from_stop_id', 'to_stop_id', 'duration')
        .from('adjacent_stops_by_routes')
        .union(function () {
          this.select('from_stop_id', 'to_stop_id', 'duration')
            .from('adjacent_stops_in_transfers');
        });
    })
    .select('from_stop_id', 'to_stop_id')
    .min('duration as time')
    .from('adjacent_stops')
    .groupBy('from_stop_id', 'to_stop_id');
}

export { getRoutes, getStops, getAdjacentStations };
