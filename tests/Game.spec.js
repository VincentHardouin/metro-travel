import { describe, expect, it } from 'vitest';
import { Game } from '../src/Game.js';

describe('game', () => {
  describe('#getInformation', () => {
    it('should return all stats for game', () => {
      const game = new Game({ seed: Number.parseInt('2eeea1', 16), mode: 'station' });

      expect(game.getInformation()).to.deep.equal({
        minTry: 5,
        stops: [
          {
            line: {
              color: '#6EC4E8',
              name: '13',
            },
            stop_name: 'Pernety',
            stop_unique_id: 'IDFM:412687',
          },
          {
            line: {
              color: '#6EC4E8',
              name: '13',
            },
            stop_name: 'Gaîté',
            stop_unique_id: 'IDFM:73675',
          },
          {
            line: {
              color: '#6EC4E8',
              name: '13',
            },
            stop_name: 'Gare Montparnasse',
            stop_unique_id: 'IDFM:71139',
          },
          {
            line: {
              color: '#A0006E',
              name: '4',
            },
            stop_name: 'Gare Montparnasse',
            stop_unique_id: 'IDFM:71139',
          },
          {
            line: {
              color: '#A0006E',
              name: '4',
            },
            stop_name: 'Vavin',
            stop_unique_id: 'IDFM:71117',
          },
          {
            line: {
              color: '#A0006E',
              name: '4',
            },
            stop_name: 'Raspail',
            stop_unique_id: 'IDFM:71088',
          },
          {
            line: {
              color: '#A0006E',
              name: '4',
            },
            stop_name: 'Denfert-Rochereau',
            stop_unique_id: 'IDFM:71056',
          },
          {
            line: {
              color: '#A0006E',
              name: '4',
            },
            stop_name: 'Mouton-Duvernet',
            stop_unique_id: 'IDFM:73653',
          },
        ],
        try: 0,
      });
    });
  });
});
