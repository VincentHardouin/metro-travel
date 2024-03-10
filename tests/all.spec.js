import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

const linesData = JSON.parse(fs.readFileSync('./assets/lines.geojson'));
const stationsData = JSON.parse(fs.readFileSync('./assets/stations.geojson'));

const lines = linesData.features;
const stations = stationsData.features;

describe('metro data', () => {
  describe('lines', () => {
    it('should have 16 lines', () => {
      expect(new Set(lines.map(l => l.properties.ref)).size).toBe(16);
    });

    it('all lines should have name', () => {
      lines.forEach((l) => {
        expect(l.properties.name).toBeDefined();
      });
    });
  });

  describe('stations', () => {
    it('should have 291 stations instead of 302', () => {
      expect(stations.length).toBe(291);
    });

    it('all stations should have coordinates', () => {
      stations.forEach((s) => {
        expect(s.geometry.coordinates).toBeDefined();
      });
    });

    it('all stations should have lines', () => {
      stations.forEach((s) => {
        expect(s.properties.lines).toBeDefined();
      });
    });

    it.skip('all stations should have name', () => {
      stations.forEach((s) => {
        try {
          expect(s.properties.name).toBeDefined();
        }
        catch (e) {
          expect.fail(`Station ${JSON.stringify(s.properties, 2)} has no name`);
        }
      });
    });

    it.skip('all stations should have adjacent stations', () => {
      stations.forEach((s) => {
        try {
          expect(s.properties.adjacentStations).toBeDefined();
        }
        catch (e) {
          expect.fail(`Station ${s.properties.name} has no adjacent stations`);
        }
      });
    });
  });
});
