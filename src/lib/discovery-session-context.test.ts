import { describe, expect, test } from 'bun:test';
import { decodeDiscoveryContext, encodeDiscoveryContext } from './discovery-session-context';

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
});
