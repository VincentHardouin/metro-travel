import { describe, expect, it } from 'vitest';
import { mergeDuplicateStations } from '../src/merge-duplicate-stations.js';

describe('merge-duplicate-stations', () => {
  it('should keep only metro stations with relations', () => {
    const data = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            'name': 'station stop_position with type RATP metro',
            'type:RATP': 'metro',
            'public_transport': 'stop_position',
            '@relations': [
              { reltags: { name: 'line1' } },
            ],
          },
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
        {
          type: 'Feature',
          properties: {
            'name': 'station stop_position with subway',
            'public_transport': 'stop_position',
            'subway': 'yes',
            '@relations': [
              { reltags: { name: 'line2' } },
            ],
          },
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
        {
          type: 'Feature',
          properties: {
            'name': 'station railway stop',
            'railway': 'stop',
            '@relations': [
              { reltags: { name: 'line3' } },
            ],
          },
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
        {
          type: 'Feature',
          properties: {
            name: 'station without relation',
            railway: 'stop',
          },
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
        {
          type: 'Feature',
          properties: {
            name: 'another feature',
          },
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
      ],
    };

    const result = mergeDuplicateStations({ data });

    expect(result.features.map(f => f.properties.name)).to.deep.equal([
      'station stop_position with type RATP metro',
      'station stop_position with subway',
      'station railway stop',
    ]);
  });

  describe('when stations have the same name', () => {
    it('should merge it into one station', () => {
      const data = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              'name': 'station 1',
              'type:RATP': 'metro',
              'public_transport': 'stop_position',
              '@relations': [
                { reltags: { name: 'line1' } },
              ],
            },
            geometry: {
              type: 'Point',
              coordinates: [0, 0],
            },
          },
          {
            type: 'Feature',
            properties: {
              'name': 'station 1',
              'public_transport': 'stop_position',
              'subway': 'yes',
              '@relations': [
                { reltags: { name: 'line2' } },
              ],
            },
            geometry: {
              type: 'Point',
              coordinates: [0, 1],
            },
          },
        ],
      };

      const result = mergeDuplicateStations({ data });

      expect(result.features).to.deep.equal([
        {
          type: 'Feature',
          properties: {
            'name': 'station 1',
            'type:RATP': 'metro',
            'public_transport': 'stop_position',
            '@relations': [
              { reltags: { name: 'line1' } },
            ],
            'coordinates': [
              [0, 0],
              [0, 1],
            ],
            'lines': [
              'line1',
              'line2',
            ],
          },
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
      ]);
    });
  });

  describe('when stations have same name without accented characters', () => {
    it('should merge it into one station', () => {
      const data = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              'name': 'station 1 é',
              'type:RATP': 'metro',
              'public_transport': 'stop_position',
              '@relations': [
                { reltags: { name: 'line1' } },
              ],
            },
            geometry: {
              type: 'Point',
              coordinates: [0, 0],
            },
          },
          {
            type: 'Feature',
            properties: {
              'name': 'station 1 e',
              'public_transport': 'stop_position',
              'subway': 'yes',
              '@relations': [
                { reltags: { name: 'line2' } },
              ],
            },
            geometry: {
              type: 'Point',
              coordinates: [0, 1],
            },
          },
        ],
      };

      const result = mergeDuplicateStations({ data });

      expect(result.features).to.deep.equal([
        {
          type: 'Feature',
          properties: {
            'name': 'station 1 é',
            'type:RATP': 'metro',
            'public_transport': 'stop_position',
            '@relations': [
              { reltags: { name: 'line1' } },
            ],
            'coordinates': [
              [0, 0],
              [0, 1],
            ],
            'lines': [
              'line1',
              'line2',
            ],
          },
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
      ]);
    });
  });
});
