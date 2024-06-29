import { afterEach, describe, expect, it } from 'vitest';
import { saveRoutes, saveStopTimes, saveStops, saveTransfers, saveTrips } from '../scripts/save-data.js';
import {
  fillPathsInAdjacentStop,
  getAdjacentStops,
  getRoutes,
  getRoutesPaths,
  getStops,
} from '../scripts/extract-data.js';
import { emptyAllTables } from '../db/knex-database-connection.js';

describe('extract-data', () => {
  afterEach(async () => {
    await emptyAllTables();
  });

  describe('#getRoutes', () => {
    it('should extract routes', async () => {
      const routes = [
        {
          route_id: 'IDFM:C01371',
          route_short_name: '1',
          route_long_name: 'M1',
          route_desc: '',
          route_type: 1,
          route_color: 'FFBE00',
          route_text_color: '000000',
        },
        {
          route_id: 'IDFM:C02U21',
          route_short_name: '1',
          route_long_name: 'T1',
          route_desc: '',
          route_type: 0,
          route_color: 'FFBE00',
          route_text_color: '000000',
        },
      ];
      await saveRoutes(routes);

      const results = await getRoutes();

      const expectedRoutes = [
        {
          route_id: 'IDFM:C01371',
          route_name: '1',
          route_color: 'FFBE00',
          route_text_color: '000000',
        },
      ];
      expect(results).to.deep.equal(expectedRoutes);
    });
  });

  describe('#getStops', () => {
    it('should extract stops', async () => {
      const routes = [
        {
          route_id: 'IDFM:C01371',
          route_short_name: '1',
          route_long_name: 'M1',
          route_desc: '',
          route_type: 1,
          route_color: 'FFBE00',
          route_text_color: '000000',
        },
        {
          route_id: 'IDFM:C02U21',
          route_short_name: '1',
          route_long_name: 'T1',
          route_desc: '',
          route_type: 0,
          route_color: 'FFBE00',
          route_text_color: '000000',
        },
      ];
      await saveRoutes(routes);

      const trips = [
        {
          route_id: 'IDFM:C01371',
          service_id: 'IDFM:1',
          trip_id: 'tripID1',
          trip_headsign: 'GDN',
          direction_id: '0',
          block_id: null,
          shape_id: null,
        },
        {
          route_id: 'IDFM:C01371',
          service_id: 'IDFM:1',
          trip_id: 'tripID2',
          trip_headsign: 'GDN',
          direction_id: '1',
          block_id: null,
          shape_id: null,
        },
        {
          route_id: 'IDFM:C02U21',
          service_id: 'IDFM:12',
          trip_id: 'tripID3',
          trip_headsign: 'GDN',
          direction_id: '1',
          block_id: null,
          shape_id: null,
        },
      ];
      await saveTrips(trips);

      const stopTimes = [
        {
          trip_id: 'tripID1',
          arrival_time: '08:00:00',
          departure_time: '08:02:00',
          stop_id: 'IDFM:10181',
          stop_sequence: 1,
        },
        {
          trip_id: 'tripID2',
          arrival_time: '08:00:00',
          departure_time: '08:02:00',
          stop_id: 'IDFM:10181',
          stop_sequence: 1,
        },
        {
          trip_id: 'tripID3',
          arrival_time: '08:00:00',
          departure_time: '08:02:00',
          stop_id: 'IDFM:10182',
          stop_sequence: 1,
        },
      ];
      await saveStopTimes(stopTimes);

      const stops = [
        {
          stop_id: 'IDFM:10181',
          stop_name: 'Gare de Lyon',
          stop_desc: '',
          stop_lat: 48.844847,
          stop_lon: 2.373273,
          zone_id: '',
          stop_url: '',
          parent_station: 'IDFM:C01372',
          location_type: 1,
          platform_code: '',
        },
        {
          stop_id: 'IDFM:10182',
          stop_name: 'Gare du Nord',
          stop_desc: '',
          stop_lat: 48.844847,
          stop_lon: 2.373273,
          zone_id: '',
          stop_url: '',
          location_type: 0,
          parent_station: '',
          platform_code: '',
        },
      ];
      await saveStops(stops);

      const results = await getStops();

      const expectedRoutes = [
        {
          stop_id: 'IDFM:10181',
          stop_lat: 48.844847,
          stop_lon: 2.373273,
          stop_name: 'Gare de Lyon',
          route_id: 'IDFM:C01371',
          parent_station: 'IDFM:C01372',
        },
      ];
      expect(results).to.deep.equal(expectedRoutes);
    });
  });

  describe('#getAdjacentStops', () => {
    it('should extract adjacent stations', async () => {
      const routes = [
        {
          route_id: 'IDFM:C01371',
          route_short_name: '1',
          route_long_name: 'M1',
          route_desc: '',
          route_type: 1,
          route_color: 'FFBE00',
          route_text_color: '000000',
        },
        {
          route_id: 'IDFM:C02U21',
          route_short_name: '1',
          route_long_name: 'T1',
          route_desc: '',
          route_type: 0,
          route_color: 'FFBE00',
          route_text_color: '000000',
        },
      ];
      await saveRoutes(routes);

      const trips = [
        {
          route_id: 'IDFM:C01371',
          service_id: 'IDFM:1',
          trip_id: 'tripID1',
          trip_headsign: 'GDN',
          direction_id: '0',
          block_id: null,
          shape_id: null,
        },
        {
          route_id: 'IDFM:C01371',
          service_id: 'IDFM:1',
          trip_id: 'tripID2',
          trip_headsign: 'GDN',
          direction_id: '1',
          block_id: null,
          shape_id: null,
        },
        {
          route_id: 'IDFM:C02U21',
          service_id: 'IDFM:12',
          trip_id: 'tripID3',
          trip_headsign: 'GDN',
          direction_id: '1',
          block_id: null,
          shape_id: null,
        },
      ];
      await saveTrips(trips);

      const stopTimes = [
        {
          trip_id: 'tripID1',
          arrival_time: '08:00:00',
          departure_time: '08:02:00',
          stop_id: 'IDFM:10181',
          stop_sequence: 1,
        },
        {
          trip_id: 'tripID1',
          arrival_time: '08:03:00',
          departure_time: '08:04:00',
          stop_id: 'IDFM:10182',
          stop_sequence: 2,
        },
        {
          trip_id: 'tripID1',
          arrival_time: '08:05:00',
          departure_time: '08:06:00',
          stop_id: 'IDFM:10183',
          stop_sequence: 3,
        },
      ];
      await saveStopTimes(stopTimes);

      const adjacentStops = await getAdjacentStops();

      const expectedAdjacentStops = [
        {
          from_stop_id: 'IDFM:10181',
          time: 180,
          to_stop_id: 'IDFM:10182',
        },
        {
          from_stop_id: 'IDFM:10182',
          time: 180,
          to_stop_id: 'IDFM:10181',
        },
        {
          from_stop_id: 'IDFM:10182',
          time: 120,
          to_stop_id: 'IDFM:10183',
        },
        {
          from_stop_id: 'IDFM:10183',
          time: 120,
          to_stop_id: 'IDFM:10182',
        },
      ];
      expect(adjacentStops).to.deep.equal(expectedAdjacentStops);
    });

    it('should extract adjacent stations from transfers', async () => {
      const routes = [
        {
          route_id: 'IDFM:C01371',
          route_short_name: '1',
          route_long_name: 'M1',
          route_desc: '',
          route_type: 1,
          route_color: 'FFBE00',
          route_text_color: '000000',
        },
        {
          route_id: 'IDFM:C02U21',
          route_short_name: '1',
          route_long_name: 'T1',
          route_desc: '',
          route_type: 0,
          route_color: 'FFBE00',
          route_text_color: '000000',
        },
      ];
      await saveRoutes(routes);

      const trips = [
        {
          route_id: 'IDFM:C01371',
          service_id: 'IDFM:1',
          trip_id: 'tripID1',
          trip_headsign: 'GDN',
          direction_id: '0',
          block_id: null,
          shape_id: null,
        },
        {
          route_id: 'IDFM:C01371',
          service_id: 'IDFM:1',
          trip_id: 'tripID2',
          trip_headsign: 'GDN',
          direction_id: '1',
          block_id: null,
          shape_id: null,
        },
      ];
      await saveTrips(trips);

      const stopTimes = [
        {
          trip_id: 'tripID1',
          arrival_time: '08:00:00',
          departure_time: '08:02:00',
          stop_id: 'IDFM:10181',
          stop_sequence: 1,
        },
        {
          trip_id: 'tripID2',
          arrival_time: '08:03:00',
          departure_time: '08:04:00',
          stop_id: 'IDFM:10182',
          stop_sequence: 2,
        },
        {
          trip_id: 'tripID1',
          arrival_time: '08:05:00',
          departure_time: '08:06:00',
          stop_id: 'IDFM:10183',
          stop_sequence: 3,
        },
      ];
      await saveStopTimes(stopTimes);

      const transfers = [
        {
          from_stop_id: 'IDFM:10181',
          to_stop_id: 'IDFM:10182',
          min_transfer_time: 180,
          transfer_type: 2,
        },
        {
          from_stop_id: 'IDFM:10182',
          to_stop_id: 'IDFM:10181',
          min_transfer_time: 180,
          transfer_type: 2,
        },
        {
          from_stop_id: 'IDFM:10182',
          to_stop_id: 'IDFM:10183',
          min_transfer_time: 120,
          transfer_type: 2,
        },
        {
          from_stop_id: 'IDFM:10183',
          to_stop_id: 'IDFM:10182',
          min_transfer_time: 120,
          transfer_type: 2,
        },
      ];

      await saveTransfers(transfers);

      const adjacentStops = await getAdjacentStops();

      const expectedAdjacentStops = [
        {
          from_stop_id: 'IDFM:10181',
          time: 180,
          to_stop_id: 'IDFM:10182',
        },
        {
          from_stop_id: 'IDFM:10182',
          time: 180,
          to_stop_id: 'IDFM:10181',
        },
        {
          from_stop_id: 'IDFM:10182',
          time: 120,
          to_stop_id: 'IDFM:10183',
        },
        {
          from_stop_id: 'IDFM:10183',
          time: 120,
          to_stop_id: 'IDFM:10182',
        },
      ];
      expect(adjacentStops).to.deep.equal(expectedAdjacentStops);
    });
  });

  describe.skip('#getRoutePath', () => {
    it('should extract route path', async () => {
      const routePaths = await getRoutesPaths();

      expect(routePaths.map(path => ({
        route_id: path.route_id,
        coordinates: path.coordinates,
      }))).to.deep.equal([{ ID: 'IDFM:C01371' }]);
    });
  });

  describe.skip('#fillPathInAdjacenStop', () => {
    it('should fill path', async () => {
      const stations = await getStops();
      const adjacentStops = await getAdjacentStops();
      const routePaths = await getRoutesPaths();

      const result = await fillPathsInAdjacentStop({ adjacentStops, stations, routePaths });

      expect(result).to.deep.equal([]);
    });
  });
});
