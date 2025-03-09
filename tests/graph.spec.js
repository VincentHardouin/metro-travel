import { describe, expect, it } from 'vitest';
import { computeSmallestStationsPath, verifyIfConnected } from '../src/graph.js';
import { getAdjacentStops, getUniqueStops } from '../src/utils.js';

describe('graph', () => {
  describe('#computeSmallestStationsPath', () => {
    it('should return always same value for given seed', () => {
      const adjacentStops = getAdjacentStops();
      const uniqueStops = getUniqueStops();

      const startName = 'Notre-Dame-de-Lorette';
      const endName = 'Brochant';

      const start = uniqueStops.find(stop => stop.stop_name === startName).stop_unique_id;
      const end = uniqueStops.find(stop => stop.stop_name === endName).stop_unique_id;

      const path = computeSmallestStationsPath({ start, end, adjacentStops });

      expect(path).to.deep.equal({
        distance: 491,
        path: [
          'IDFM:22050',
          'IDFM:463317',
          'IDFM:21964',
          'IDFM:22218',
          'IDFM:22225',
          'IDFM:22129',
          'IDFM:22227',
          'IDFM:22231',
        ],
      });
    });

    describe('when provided mode is time', () => {
      it('should return the smallest duration', () => {
        const adjacentStops = getAdjacentStops();

        const start = {
          stop_unique_id: 'IDFM:412687',
          stop_name: 'Pernety',
        };
        const end = {
          stop_unique_id: 'IDFM:73653',
          stop_name: 'Mouton-Duvernet',
        };

        const path = computeSmallestStationsPath({
          start: start.stop_unique_id,
          end: end.stop_unique_id,
          adjacentStops,
          mode: 'time',
        });

        expect(path).to.deep.equal({
          distance: 437,
          path: [
            'IDFM:463229',
            'IDFM:463184',
            'IDFM:462954',
            'IDFM:462955',
            'IDFM:22172',
            'IDFM:22155',
            'IDFM:22158',
            'IDFM:463103',
            'IDFM:463104',
            'IDFM:22144',
          ],
        });
      });
    });

    describe('when provided mode is station', () => {
      it('should return the smallest path', () => {
        const adjacentStops = getAdjacentStops();

        const start = {
          stop_unique_id: 'IDFM:412687',
          stop_name: 'Pernety',
        };
        const end = {
          stop_unique_id: 'IDFM:73653',
          stop_name: 'Mouton-Duvernet',
        };

        const path = computeSmallestStationsPath({
          start: start.stop_unique_id,
          end: end.stop_unique_id,
          adjacentStops,
          mode: 'station',
        });

        expect(path).to.deep.equal({
          distance: 7,
          path: [
            'IDFM:22222',
            'IDFM:22230',
            'IDFM:22157',
            'IDFM:22143',
            'IDFM:463016',
            'IDFM:22131',
            'IDFM:463104',
            'IDFM:22144',
          ],
        });
      });
    });
  });

  describe('#verifyIsConnected', () => {
    it('should return true when stations is connected', () => {
      const adjacentStops = getAdjacentStops();
      const uniqueStops = getUniqueStops();

      const pickedUniqueStations = [
        'Notre-Dame-de-Lorette',
        'Brochant',
        'Trinité - d\'Estienne d\'Orves',
        'Gare Saint-Lazare',
        'Liège',
        'Place de Clichy',
        'La Fourche',
      ];

      const pickedUniqueStopsIds = uniqueStops
        .filter((stop) => {
          return pickedUniqueStations.includes(stop.stop_name);
        })
        .map(stop => stop.stop_unique_id);

      const startUniqueId = uniqueStops.find(stop => stop.stop_name === 'Notre-Dame-de-Lorette').stop_unique_id;
      const endUniqueId = uniqueStops.find(stop => stop.stop_name === 'Brochant').stop_unique_id;

      expect(pickedUniqueStopsIds.length).to.equal(7);

      const isConnected = verifyIfConnected({
        start: startUniqueId,
        end: endUniqueId,
        stationsToVerify: pickedUniqueStopsIds,
        adjacentStops,
      });

      expect(isConnected).toBeTruthy();
    });

    it('should return false when stations is not connected', () => {
      const adjacentStops = getAdjacentStops();
      const uniqueStops = getUniqueStops();

      const pickedUniqueStations = [
        'Notre-Dame-de-Lorette',
        'Brochant',
        'Trinité - d\'Estienne d\'Orves',
        'Gare Saint-Lazare',
        'Liège',
        'La Fourche',
      ];

      const pickedUniqueStopsIds = uniqueStops
        .filter((stop) => {
          return pickedUniqueStations.includes(stop.stop_name);
        })
        .map(stop => stop.stop_unique_id);

      const startUniqueId = uniqueStops.find(stop => stop.stop_name === 'Notre-Dame-de-Lorette').stop_unique_id;
      const endUniqueId = uniqueStops.find(stop => stop.stop_name === 'Brochant').stop_unique_id;

      expect(pickedUniqueStopsIds.length).to.equal(6);

      const isConnected = verifyIfConnected({
        start: startUniqueId,
        end: endUniqueId,
        stationsToVerify: pickedUniqueStopsIds,
        adjacentStops,
      });

      expect(isConnected).toBeFalsy();
    });
  });
});
