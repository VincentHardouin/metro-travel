import { access, constants, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import url from 'node:url';
import process from 'node:process';
import { disconnect, knex } from '../db/knex-database-connection.js';

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
  const stops = await knex('stops')
    .select(
      'stops.stop_id',
      'stops.stop_name',
      'stops.stop_lat',
      'stops.stop_lon',
      'routes.route_id',
      'stops.parent_station',
    )
    .join('stop_times', 'stops.stop_id', 'stop_times.stop_id')
    .join('trips', 'stop_times.trip_id', 'trips.trip_id')
    .join('routes', 'trips.route_id', 'routes.route_id')
    .where('routes.route_type', 1)
    .groupBy('stops.stop_id', 'routes.route_id');

  return stops.map((stop) => {
    return {
      stop_id: stop.stop_id,
      stop_name: stop.stop_name,
      stop_lat: stop.stop_lat,
      stop_lon: stop.stop_lon,
      route_id: stop.route_id,
      parent_station: stop.parent_station,
    };
  });
}

async function getAdjacentStops() {
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

async function getRoutesPaths() {
  const filePath = path.resolve(`${os.homedir()}/Downloads/traces-des-lignes-de-transport-en-commun-idfm.geojson`);
  await _verifyPath(filePath);
  const file = await readFile(filePath, 'utf8');
  const routePaths = JSON.parse(file);
  return routePaths.features.filter(feature => feature.properties.route_type === 'Subway');
}

async function _verifyPath(dirPath) {
  try {
    await access(dirPath, constants.R_OK);
  }
  catch (e) {
    throw new Error(`The path ${dirPath} is not accessible.`);
  }
}

async function fillPathsInAdjacentStop({ adjacentStops, stations, routePaths }) {
  const stationsMap = stations.reduce((acc, station) => {
    acc[station.stop_id] = station;
    return acc;
  }, {});
  return adjacentStops.map((adjacentStation) => {
    const fromStation = stationsMap[adjacentStation.from_stop_id];
    const toStation = stationsMap[adjacentStation.to_stop_id];

    if (fromStation.route_id !== toStation.route_id) {
      return {
        from_stop_id: adjacentStation.from_stop_id,
        to_stop_id: adjacentStation.to_stop_id,
        duration: adjacentStation.time,
        path: null,
      };
    }

    const routePath = routePaths.find((routePath) => {
      return routePath.properties.route_id === fromStation.route_id;
    });

    for (const line of routePath.geometry.coordinates) {
      const fromIndex = line.findIndex((coord) => {
        return coord[0] === fromStation.stop_lon && coord[1] === fromStation.stop_lat;
      });

      const toIndex = line.findIndex((coord) => {
        return coord[0] === toStation.stop_lon && coord[1] === toStation.stop_lat;
      });

      if (fromIndex !== -1 && toIndex !== -1) {
        let path;
        if (fromIndex < toIndex)
          path = line.slice(fromIndex, toIndex + 1);
        else
          path = line.slice(toIndex, fromIndex + 1);

        return {
          from_stop_id: adjacentStation.from_stop_id,
          to_stop_id: adjacentStation.to_stop_id,
          duration: adjacentStation.time,
          path,
          route_id: fromStation.route_id,
        };
      }
    }

    return {
      from_stop_id: adjacentStation.from_stop_id,
      to_stop_id: adjacentStation.to_stop_id,
      duration: adjacentStation.time,
      path: null,
    };
  });
}

async function getUniqueStops() {
  const stops = await knex('stops')
    .select(
      'stops.stop_id',
      'stops.stop_name',
      'stops.stop_lat',
      'stops.stop_lon',
      'stops.parent_station',
    )
    .from('stops')
    .where('location_type', 1);
  return stops.map((stop) => {
    return {
      stop_unique_id: stop.stop_id,
      stop_name: stop.stop_name,
      stop_lat: stop.stop_lat,
      stop_lon: stop.stop_lon,
    };
  });
}

async function main() {
  const stops = await getStops();
  const adjacentStops = await getAdjacentStops();
  const routePaths = await getRoutesPaths();
  const routes = routePaths.map(_keepOnlyRouteProperties);
  const adjacentStopsWithPath = await fillPathsInAdjacentStop({ adjacentStops, stations: stops, routePaths });
  const uniqueStops = await getUniqueStops();

  const filteredUniqueStops = uniqueStops.filter(stop => stops.find(s => s.parent_station === stop.stop_unique_id));

  const adjacentStopsWithPathAndWithUniqueId = adjacentStopsWithPath.map((adjacentStation) => {
    const fromStop = stops.find(stop => stop.stop_id === adjacentStation.from_stop_id);
    const toStop = stops.find(stop => stop.stop_id === adjacentStation.to_stop_id);
    return {
      ...adjacentStation,
      from_stop_unique_id: fromStop.parent_station,
      to_stop_unique_id: toStop.parent_station,
    };
  });

  await saveData({
    routes,
    stops,
    adjacentStops: adjacentStopsWithPathAndWithUniqueId,
    uniqueStops: filteredUniqueStops,
  });
}

function _keepOnlyRouteProperties(route) {
  return {
    ...route.properties,
  };
}

async function saveData(data) {
  await writeFile('./assets/data.json', JSON.stringify(data, null, 2));
}

const modulePath = url.fileURLToPath(import.meta.url);
const isLaunchedFromCommandLine = process.argv[1] === modulePath;

(async () => {
  if (isLaunchedFromCommandLine) {
    try {
      await main();
    }
    catch (error) {
      console.error(error);
      process.exitCode = 1;
    }
    finally {
      await disconnect();
    }
  }
})();

export { getRoutes, getStops, getAdjacentStops, getRoutesPaths, fillPathsInAdjacentStop };
