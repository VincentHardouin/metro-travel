import { describe, expect, it } from 'vitest';
import { parseData } from '../scripts/parse-data.js';

describe('parse-data', () => {
  describe('#parseData', () => {
    it('should parse csv string to json', async () => {
      const routesString = `route_id,agency_id,route_short_name,route_long_name,route_desc,route_type,route_url,route_color,route_text_color,route_sort_order
IDFM:C01371,IDFM:Operator_100,1,1,,1,,FFBE00,000000,
IDFM:C01286,IDFM:Operator_100,322,322,,3,,82C8E6,000000,
IDFM:C01153,IDFM:Operator_100,124,124,,3,,FF82B4,000000,`;

      const routes = await parseData(routesString);

      expect(routes.data).to.be.deep.equal([
        {
          agency_id: 'IDFM:Operator_100',
          route_color: 'FFBE00',
          route_desc: null,
          route_id: 'IDFM:C01371',
          route_long_name: '1',
          route_short_name: '1',
          route_sort_order: null,
          route_text_color: '000000',
          route_type: '1',
          route_url: null,
        },
        {
          agency_id: 'IDFM:Operator_100',
          route_color: '82C8E6',
          route_desc: null,
          route_id: 'IDFM:C01286',
          route_long_name: '322',
          route_short_name: '322',
          route_sort_order: null,
          route_text_color: '000000',
          route_type: '3',
          route_url: null,
        },
        {
          agency_id: 'IDFM:Operator_100',
          route_color: 'FF82B4',
          route_desc: null,
          route_id: 'IDFM:C01153',
          route_long_name: '124',
          route_short_name: '124',
          route_sort_order: null,
          route_text_color: '000000',
          route_type: '3',
          route_url: null,
        },
      ]);
    });
  });
});
