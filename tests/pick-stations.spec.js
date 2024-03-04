import { describe, test, expect } from 'vitest';
import { pickStations, getSeededRandomStations } from '../src/pick-stations.js';
import { getStations } from '../src/utils.js';

describe('pick-stations', () => {
  test('should return always same value for given seed', () => {
    const stations = getStations();
    const result1 = pickStations({ stations, random: getSeededRandomStations(2) });
    const result2 = pickStations({ stations, random: getSeededRandomStations(2) });

    expect(result1).to.deep.equal(result2)
  })
})
