import { afterEach, describe, expect, it } from 'vitest';
import { saveRoutes, saveStopTimes, saveStops, saveTrips } from '../scripts/save-data.js';
import { getRoutes, getStops } from '../scripts/extract-data.js';
import { knex } from '../db/knex-database-connection.js';

describe('extract-data', () => {
  describe('#getRoutes', () => {
    afterEach(async () => {
      await knex('routes').del();
    });

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
    afterEach(async () => {
      await knex('routes').del();
      await knex('trips').del();
      await knex('stop_times').del();
      await knex('stops').del();
    });

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
          parent_station: '',
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
        },
      ];
      expect(results).to.deep.equal(expectedRoutes);
    });
  });
});
