import { describe, expect, it } from 'vitest';
import { searchStations } from '../src/utils.front.js';

describe('utils.front', () => {
  describe('#searchStations', () => {
    it('should return stations with current search case insensitive', () => {
      const stations = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

      const filteredStations = searchStations('a', stations);

      expect(filteredStations).to.deep.equal(['A']);
    });

    it('should return stations beginning with current search before', () => {
      const stations = ['AB', 'B', 'CB', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

      const filteredStations = searchStations('b', stations);

      expect(filteredStations).to.deep.equal(['B', 'AB', 'CB']);
    });

    it('should return stations beginning with current search before case insensitive', () => {
      const stations = ['Abbesses', 'Alésia', 'Saint-Lazare', 'Saint-Michel'];

      const filteredStations = searchStations('S', stations);

      expect(filteredStations).to.deep.equal([
        'Saint-Lazare',
        'Saint-Michel',
        'Abbesses',
        'Alésia',
      ]);
    });

    it('should return stations beginning with current search with space instead of -', () => {
      const stations = ['Basilique de Saint-Denis', 'Saint-Lazare', 'Saint-Michel'];

      const filteredStations = searchStations('Saint ', stations);

      expect(filteredStations).to.deep.equal([
        'Saint-Lazare',
        'Saint-Michel',
        'Basilique de Saint-Denis',
      ]);
    });

    it('should search without accents', () => {
      const stations = ['E', 'É'];

      const filteredStations = searchStations('E', stations);

      expect(filteredStations).to.deep.equal(['E', 'É']);
    });

    it('should normalize search wit accents', () => {
      const stations = ['E', 'É'];

      const filteredStations = searchStations('é', stations);

      expect(filteredStations).to.deep.equal(['E', 'É']);
    });

    it('should return station without - in search', () => {
      const stations = ['Saint-Lazare'];

      const filteredStations = searchStations('Saint Lazare', stations);

      expect(filteredStations).to.deep.equal(['Saint-Lazare']);
    });
  });
});
