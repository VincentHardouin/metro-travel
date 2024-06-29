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
