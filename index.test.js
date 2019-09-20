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

  test('search with empty value fails with error', () => {
    return expect(wiki.search()).rejects.toMatch('The search value cannot be empty!');
  });

  test('Wrong limit value fails with warning', () => {
    return expect(wiki.search('code', -20)).rejects.toEqual(expect.stringContaining('Warning'));
  });

  test('Wrong offset value fails with error', () => {
    return expect(wiki.search('code', 20, -10)).rejects.toEqual(expect.stringContaining('Error'));
  });
});

describe('random', () => {
  test('call without limit should return 20 random pages', () => {
    return wiki.random().then(data => {
      expect(data.random.length).toBeLessThanOrEqual(20);
      expect(data.limit).toBe(20);
      expect(data).toHaveProperty('rncontinue');
    });
  });

  test('Wrong limit value fails with warning', () => {
    return expect(wiki.random(-20)).rejects.toEqual(expect.stringContaining('Warning'));
  });
});
