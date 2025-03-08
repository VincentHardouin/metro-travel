import { describe, expect, it } from 'vitest';
import { Game } from '../src/Game.js';

describe('game', () => {
  describe('#getInformation', () => {
    it('should return all stats for game', () => {
      const game = new Game('123');
      game.parisMap = {
        addStation: () => {
        },
      };

      game.addStation({ station: game.pick.start.stop_name, color: '#008a22' });
      game.addStation({ station: game.pick.end.stop_name, color: '#e52228' });

      expect(game.getInformation()).to.deep.equal({
        minTry: 17,
        stops: [
          'Mairie de Montreuil - Ligne 9',
          'Croix de Chavaux - Ligne 9',
          'Robespierre - Ligne 9',
          'Porte de Montreuil - Ligne 9',
          'Maraîchers - Ligne 9',
          'Buzenval - Ligne 9',
          'Nation - Ligne 9',
          'Nation - Ligne 6',
          'Picpus - Ligne 6',
          'Bel-Air - Ligne 6',
          'Daumesnil - Ligne 6',
          'Dugommier - Ligne 6',
          'Bercy - Ligne 6',
          'Quai de la Gare - Ligne 6',
          'Chevaleret - Ligne 6',
          'Nationale - Ligne 6',
          'Place d\'Italie - Ligne 6',
          'Corvisart - Ligne 6',
          'Glacière - Ligne 6',
        ],
        try: 0,
      });
    });
  });
});
