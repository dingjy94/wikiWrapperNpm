import wiki from './index';
import { exportAllDeclaration } from '@babel/types';

describe('search', () => {
  test('search a word without limit and page parameters should return 20 related pages on first page', () => {
    return wiki.search('code').then(data => {
      expect(data.search.length).toBeLessThanOrEqual(20);
      expect(data.limit).toBe(20);
      expect(data.page).toBe(0);
      expect(data.total).toBeGreaterThanOrEqual(0);
    });
  });
});
