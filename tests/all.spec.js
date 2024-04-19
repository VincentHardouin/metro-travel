import { describe, expect, it } from 'vitest';
import data from '../assets/data.json' assert {type: 'json'};

describe('metro data', () => {
  describe('routes', () => {
    it('should have 25 routes', () => {
      expect(data.routes).to.have.length(16);
    });
  });

  describe('uniqueStops', () => {
    it('should have 308 stops', () => {
      expect(data.uniqueStops).to.have.length(308);
    });
  });

  describe('stops', () => {
    it('all stop should have unique stops id', () => {
      data.stops.forEach((stop) => {
        expect(stop.stop_unique_id).to.be.a('string');
      });
    });
  });

  describe('adjacentStops', () => {
    it('all adjacent stations should have unique stops id', () => {
      data.adjacentStops.forEach((adjacentStation) => {
        expect(adjacentStation.from_stop_unique_id).to.be.a('string');
        expect(adjacentStation.to_stop_unique_id).to.be.a('string');
      });
    });
  });
});
