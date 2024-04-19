import { afterEach, describe, expect, it } from 'vitest';
import { emptyAllTables, knex } from '../db/knex-database-connection.js';
import { savePathways, saveRoutes, saveStopTimes, saveStops, saveTransfers, saveTrips } from '../scripts/save-data.js';
import { parseData } from '../scripts/parse-data.js';

describe('save-data', () => {
  afterEach(async () => {
    await emptyAllTables();
  });

  describe('#saveRoutes', () => {
    it('should save routes', async () => {
      const [before] = await knex('routes').count('*');
      const routesString = `route_id,agency_id,route_short_name,route_long_name,route_desc,route_type,route_url,route_color,route_text_color,route_sort_order
IDFM:C01371,IDFM:Operator_100,1,1,,1,,FFBE00,000000,
IDFM:C01286,IDFM:Operator_100,322,322,,3,,82C8E6,000000,
IDFM:C01153,IDFM:Operator_100,124,124,,3,,FF82B4,000000,`;
      const routesData = parseData(routesString);

      await saveRoutes(routesData.data);

      const [result] = await knex('routes').count('*');
      expect(result.count - before.count).to.be.equal(3);
    });
  });

  describe('#saveTrips', () => {
    it('should save trips', async () => {
      const [before] = await knex('trips').count('*');
      const tripsString = `route_id,service_id,trip_id,trip_headsign,trip_short_name,direction_id,block_id,shape_id,wheelchair_accessible,bikes_allowed
IDFM:C00671,IDFM:1,IDFM:TRANSDEV_COEUR_ESSONNE:129405-C00671-17898940,Gare de Brétigny Brossolette,,0,,,0,0
IDFM:C02528,IDFM:1,IDFM:RDBIEVRE:129652-C02528-9936335,Croix de Berny,,0,,,1,0
IDFM:C00031,IDFM:1,IDFM:N4_MOBILITES:102364-C00031-16410001,Gare d'Ozoir,,1,,,2,0`;
      const tripsData = parseData(tripsString);

      await saveTrips(tripsData.data);

      const [result] = await knex('trips').count('*');
      expect(result.count - before.count).to.be.equal(3);
    });
  });

  describe('#saveStopTimes', () => {
    it('should save stop_times', async () => {
      const [before] = await knex('stop_times').count('*');
      const stopTimesString = `trip_id,arrival_time,departure_time,stop_id,stop_sequence,pickup_type,drop_off_type,local_zone_id,stop_headsign,timepoint
IDFM:TRANSDEV_COEUR_ESSONNE:129405-C00671-17898940,08:18:00,08:18:00,IDFM:10181,0,0,1,,,1
IDFM:TRANSDEV_COEUR_ESSONNE:129405-C00671-17898940,08:19:00,08:19:00,IDFM:3409,1,0,0,,,1
IDFM:TRANSDEV_COEUR_ESSONNE:129405-C00671-17898940,08:20:00,08:20:00,IDFM:3424,2,0,0,,,1`;
      const stopTimesData = parseData(stopTimesString);

      await saveStopTimes(stopTimesData.data);

      const [result] = await knex('stop_times').count('*');
      expect(result.count - before.count).to.be.equal(3);
    });
  });

  describe('#saveStops', () => {
    it('should save stops', async () => {
      const [before] = await knex('stops').count('*');
      const stopsString = `stop_id,stop_code,stop_name,stop_desc,stop_lon,stop_lat,zone_id,stop_url,location_type,parent_station,stop_timezone,level_id,wheelchair_boarding,platform_code
IDFM:2921,,Gare de Breuillet Village,,2.171831602352254,48.56476273942137,4,,0,IDFM:59940,Europe/Paris,,1,
IDFM:478605,,Charbonneau,,2.2858456519980943,48.55870994615249,5,,0,IDFM:478604,Europe/Paris,,1,
IDFM:7559,,Temple,,2.2454986541342277,48.94859388710433,4,,0,IDFM:65073,Europe/Paris,,0,1`;
      const stopsData = parseData(stopsString);

      await saveStops(stopsData.data);

      const [result] = await knex('stops').count('*');
      expect(result.count - before.count).to.be.equal(3);
    });
  });

  describe('#savePathways', () => {
    it('should save pathways', async () => {
      const [before] = await knex('pathways').count('*');
      const pathwaysString = `pathway_id,from_stop_id,to_stop_id,pathway_mode,is_bidirectional,length,traversal_time,stair_count,max_slope,min_width,signposted_as,reversed_signposted_as
IDFM:StopPlaceEntrance:50148638:monomodalStopPlace:47009,IDFM:StopPlaceEntrance:50148638,IDFM:monomodalStopPlace:47009,1,1,112.78,143,,,,,
IDFM:StopPlaceEntrance:50148639:monomodalStopPlace:47009,IDFM:StopPlaceEntrance:50148639,IDFM:monomodalStopPlace:47009,1,1,81.68,104,,,,,
IDFM:StopPlaceEntrance:50170264:monomodalStopPlace:47095,IDFM:StopPlaceEntrance:50170264,IDFM:monomodalStopPlace:47095,1,1,85.51,108,,,,,`;
      const pathwaysData = parseData(pathwaysString);

      await savePathways(pathwaysData.data);

      const [result] = await knex('pathways').count('*');
      expect(result.count - before.count).to.be.equal(3);
    });
  });

  describe('#saveTransfers', () => {
    it('should save transfers', async () => {
      const [before] = await knex('transfers').count('*');
      const transfersString = `from_stop_id,to_stop_id,transfer_type,min_transfer_time
IDFM:463079,IDFM:21966,2,12
IDFM:18212,IDFM:24386,2,71
IDFM:16909,IDFM:21291,2,60`;
      const transfersData = parseData(transfersString);

      await saveTransfers(transfersData.data);

      const [result] = await knex('transfers').count('*');
      expect(result.count - before.count).to.be.equal(3);
    });
  });
});
