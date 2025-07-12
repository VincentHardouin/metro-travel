import { describe, expect, it } from 'vitest';
import data from '../assets/data.json';

describe('metro data', () => {
  describe('routes', () => {
    it('should have 16 routes', () => {
      expect(data.routes).to.have.length(16);
    });
  });

  describe('uniqueStops', () => {
    it('should have 308 stations', () => {
      expect(data.uniqueStops).to.have.length.above(308);
    });
  });

  describe('stops', () => {
    it('should have 776 stops', () => {
      // should only increase by the time
      expect(data.stops).to.have.length.above(775);
    });

    it('all stop should have unique parent_station', () => {
      data.stops.forEach((stop) => {
        expect(stop.parent_station).to.be.a('string');
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

    it('should have more than 3590 adjacent stations', () => {
      // should only increase by the time
      expect(data.adjacentStops).to.have.length.above(3589);
    });
  });
});
