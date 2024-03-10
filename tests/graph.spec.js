import {describe, test, expect} from 'vitest';
import {computeSmallestStationsPath, verifyIfConnected} from '../src/graph.js';
import {getStations} from '../src/utils.js';

describe('graph', () => {
  describe('#computeSmallestStationsPath', () => {
    test('should return always same value for given seed', () => {
      const stations = getStations();

      const path = computeSmallestStationsPath({start: 'Notre-Dame de Lorette', end: 'Brochant', stations});

      expect(path).to.deep.equal({
        distance: 5,
        path: [
          "Notre-Dame de Lorette",
          "Trinité d'Estienne d'Orves",
          "Saint-Lazare",
          "Pont Cardinet",
          "Porte de Clichy",
          "Brochant",
        ],
      })
    })
  })

  describe('#verifyIsConnected', () => {
    test('should return true when stations is connected', () => {
      const stations = getStations();
      const pickStations = [
        'Notre-Dame de Lorette',
        'Brochant',
        'Trinité d\'Estienne d\'Orves',
        'Saint-Lazare',
        'Liège',
        'Place de Clichy',
        'La Fourche',
      ]
      const filteredStations = stations.filter((station) => {
        return pickStations.includes(station.properties.name)
      });
      expect(filteredStations.length).to.equal(7);

      const isConnected = verifyIfConnected({start: 'Notre-Dame de Lorette', end: 'Brochant', stations: filteredStations });

      expect(isConnected).toBeTruthy();
    })

    test('should return false when stations is connected', () => {
      const stations = getStations();
      const pickStations = [
        'Notre-Dame de Lorette',
        'Brochant',
        'Trinité d\'Estienne d\'Orves',
        'Saint-Lazare',
        'Liège',
        'La Fourche',
      ]
      const filteredStations = stations.filter((station) => {
        return pickStations.includes(station.properties.name)
      });
      expect(filteredStations.length).to.equal(6);

      const isConnected = verifyIfConnected({start: 'Notre-Dame de Lorette', end: 'Brochant', stations: filteredStations });

      expect(isConnected).toBeFalsy();
    })
  })
})
