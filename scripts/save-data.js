import { knex } from '../db/knex-database-connection.js';

async function saveRoutes(routes) {
  const filteredRoutes = routes.map((route) => {
    return {
      route_id: route.route_id,
      route_short_name: route.route_short_name,
      route_long_name: route.route_long_name,
      route_desc: route.route_desc,
      route_type: route.route_type,
      route_color: route.route_color,
      route_text_color: route.route_text_color,
    };
  });
  await knex.batchInsert('routes', filteredRoutes, 1000);
}

async function saveTrips(trips) {
  const filteredTrips = trips.map((trip) => {
    return {
      route_id: trip.route_id,
      service_id: trip.service_id,
      trip_id: trip.trip_id,
      trip_headsign: trip.trip_headsign,
      direction_id: trip.direction_id,
      block_id: trip.block_id,
      shape_id: trip.shape_id,
    };
  });
  await knex.batchInsert('trips', filteredTrips, 1000);
}

async function saveStopTimes(stopTimes) {
  const filteredStopTimes = stopTimes.map((stopTime) => {
    return {
      trip_id: stopTime.trip_id,
      arrival_time: stopTime.arrival_time,
      departure_time: stopTime.departure_time,
      stop_id: stopTime.stop_id,
      stop_sequence: stopTime.stop_sequence,
      pickup_type: stopTime.pickup_type,
      drop_off_type: stopTime.drop_off_type,
    };
  });
  await knex.batchInsert('stop_times', filteredStopTimes, 1000);
}

async function saveStops(stops) {
  const filteredStops = stops.map((stop) => {
    return {
      stop_id: stop.stop_id,
      stop_name: stop.stop_name,
      stop_desc: stop.stop_desc,
      stop_lat: stop.stop_lat,
      stop_lon: stop.stop_lon,
      zone_id: stop.zone_id,
      stop_url: stop.stop_url,
      parent_station: stop.parent_station,
      platform_code: stop.platform_code,
    };
  });
  await knex.batchInsert('stops', filteredStops, 1000);
}

async function savePathways(pathways) {
  const filteredPathways = pathways.map((pathway) => {
    return {
      pathway_id: pathway.pathway_id,
      from_stop_id: pathway.from_stop_id,
      to_stop_id: pathway.to_stop_id,
      pathway_mode: pathway.pathway_mode,
      is_bidirectional: pathway.is_bidirectional,
      traversal_time: pathway.traversal_time,
      stair_count: pathway.stair_count,
      length: pathway.length,
      max_slope: pathway.max_slope,
      min_width: pathway.min_width,
      signposted_as: pathway.signposted_as,
      reversed_signposted_as: pathway.reversed_signposted_as,
    };
  });
  await knex.batchInsert('pathways', filteredPathways, 1000);
}

function saveTransfers(transfers) {
  const filteredTransfers = transfers.map((transfer) => {
    return {
      from_stop_id: transfer.from_stop_id,
      to_stop_id: transfer.to_stop_id,
      transfer_type: transfer.transfer_type,
      min_transfer_time: transfer.min_transfer_time,
    };
  });
  return knex.batchInsert('transfers', filteredTransfers, 1000);
}

export {
  saveRoutes,
  saveTrips,
  saveStopTimes,
  saveStops,
  savePathways,
  saveTransfers,
};
