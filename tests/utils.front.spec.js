import { describe, test, expect } from 'vitest';
import { filterStationsForList } from '../src/utils.front.js';

describe('utils.front', () => {
  describe('#filterStationsForList', () => {
    test('should return stations with current search case insensitive', () => {
      const stations = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

      const filteredStations = filterStationsForList('a', stations);

      expect(filteredStations).to.deep.equal(['A']);
    })

    test('should return stations beginning with current search before', () => {
      const stations = ['AB', 'B', 'CB', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

      const filteredStations = filterStationsForList('b', stations);

      expect(filteredStations).to.deep.equal(['B', 'AB', 'CB']);
    });

    test('should return stations beginning with current search before case insensitive', () => {
      const stations = ['Abbesses', 'Alésia', 'Saint-Lazare', 'Saint-Michel'];

      const filteredStations = filterStationsForList('S', stations);

      expect(filteredStations).to.deep.equal([
        'Saint-Lazare',
        'Saint-Michel',
        'Abbesses',
        'Alésia'
      ]);
    });

    test('should return stations beginning with current search with space instead of -', () => {
      const stations = ['Basilique de Saint-Denis', 'Saint-Lazare', 'Saint-Michel'];

      const filteredStations = filterStationsForList('Saint ', stations);

      expect(filteredStations).to.deep.equal([
        'Saint-Lazare',
        'Saint-Michel',
        'Basilique de Saint-Denis'
      ]);
    });

    test('should search without accents', () => {
      const stations = ['E', 'É'];

      const filteredStations = filterStationsForList('E', stations);

      expect(filteredStations).to.deep.equal(['E', 'É']);
    });

    test('should normalize search wit accents', () => {
      const stations = ['E', 'É'];

      const filteredStations = filterStationsForList('é', stations);

      expect(filteredStations).to.deep.equal(['E', 'É']);
    });

    test('should return station without - in search', () => {
      const stations = ['Saint-Lazare'];

      const filteredStations = filterStationsForList('Saint Lazare', stations);

      expect(filteredStations).to.deep.equal(['Saint-Lazare']);
    });
  })
})
