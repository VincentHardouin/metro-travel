import fs from 'node:fs';
import { describe, test, expect } from 'vitest';

const linesData = JSON.parse(fs.readFileSync('./assets/lines.geojson'));
const stationsData = JSON.parse(fs.readFileSync('./assets/stations.geojson'))

const lines = linesData.features;
const stations = stationsData.features;

describe('Metro data', () => {
  describe('lines', () => {
    test('should have 16 lines', () => {
      expect(new Set(lines.map(l => l.properties.ref)).size).toBe(16)
    })
  })

  describe('stations', () => {
    test('should have 302 stations', () => {
      expect(stations.length).toBe(302)
    })

    test('all stations should have coordinates', () => {
      stations.forEach(s => {
        expect(s.geometry.coordinates).toBeDefined()
      })
    })

    test('all stations should have lines', () => {
      stations.forEach(s => {
        expect(s.properties.lines).toBeDefined()
      })
    })

    test('all stations should have name', () => {
      stations.forEach(s => {
        try {
          expect(s.properties.name).toBeDefined()
        } catch (e) {
          expect.fail(`Station ${JSON.stringify(s.properties, 2)} has no name`)
        }
      })
    })

    test('all stations should have adjacent stations', () => {
      stations.forEach(s => {
        try {
          expect(s.properties.adjacentStations).toBeDefined()
        } catch (e) {
          expect.fail(`Station ${s.properties.name} has no adjacent stations`)
        }
      })
    })
  })
})
