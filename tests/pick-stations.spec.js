import { describe, expect, it } from 'vitest';
import { getSeededRandomStations, pickStations } from '../src/pick-stations.js';
import { getAdjacentStops, getUniqueStops } from '../src/utils.js';

describe('pick-stations', () => {
  it('should return always same value for given seed', () => {
    const stations = getUniqueStops();
    const adjacentStops = getAdjacentStops();
    const result1 = pickStations({ stations, adjacentStops, random: getSeededRandomStations(2) });
    const result2 = pickStations({ stations, adjacentStops, random: getSeededRandomStations(2) });

    expect(result1).to.deep.equal(result2);
  });
});
