import { test, expect } from 'vitest';
import { routing } from '@/i18n/routing';

test('vitest works', () => {
  expect(1 + 1).toBe(2);
});

test('public locales are EN and TH only', () => {
  expect(routing.locales).toEqual(['en', 'th']);
  expect(routing.locales).not.toContain('ru');
});
