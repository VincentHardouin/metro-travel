import { describe, expect, it } from 'vitest';
import { Game } from '../src/Game.js';

describe('game', () => {
  describe('#getInformation', () => {
    it('should return all stats for game', () => {
      const game = new Game({ seed: Number.parseInt('2eeea1', 16), mode: 'station' });
      game.parisMap = {
        addStation: () => {
        },
      };

      game.addStation({ station: game.pick.start.stop_name, color: '#008a22' });
      game.addStation({ station: game.pick.end.stop_name, color: '#e52228' });

      expect(game.getInformation()).to.deep.equal({
        minTry: 6,
        stops: [
          'Pernety - Ligne 13',
          'Gaîté - Ligne 13',
          'Gare Montparnasse - Ligne 13',
          'Gare Montparnasse - Ligne 4',
          'Vavin - Ligne 4',
          'Raspail - Ligne 4',
          'Denfert-Rochereau - Ligne 4',
          'Mouton-Duvernet - Ligne 4',
        ],
        try: 0,
      });
    });
  });
});
