import { describe, expect, test } from 'bun:test';
import {
  buildDiscoverySearchHref,
  decodeDiscoveryContext,
  encodeDiscoveryContext,
} from './discovery-session-context';

describe('discovery session context', () => {
  test('round trips safe discovery context', () => {
    const value = {
      query: 'هوش مصنوعی',
      role: 'بنیان‌گذار',
      expertise: 'AI',
      company: 'IdeaJo',
      source: 'dashboard',
    };

    const encoded = encodeDiscoveryContext(value);
    const decoded = decodeDiscoveryContext(encoded);

    expect(decoded).toEqual(value);
  });

  test('rejects invalid context payloads', () => {
    expect(decodeDiscoveryContext('invalid')).toBeNull();
  });

  test('builds search urls without changing public product urls', () => {
    const href = buildDiscoverySearchHref('هوش مصنوعی', {
      role: 'بنیان‌گذار',
      expertise: 'AI',
      source: 'dashboard',
    });

    expect(href.startsWith('/search?')).toBe(true);
    expect(href).toContain('q=');
    expect(href).toContain('ctx=');
    expect(href).not.toContain('/product/');
  });
});
