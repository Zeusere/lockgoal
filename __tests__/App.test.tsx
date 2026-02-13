/**
 * @format
 */

import App from '../App';

declare const test: (name: string, fn: () => void) => void;
declare const expect: (value: unknown) => {toBeDefined: () => void};

test('App module is defined', () => {
  expect(App).toBeDefined();
});
