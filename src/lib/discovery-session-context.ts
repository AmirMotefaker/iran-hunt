export type DiscoverySessionContext = {
  query?: string;
  role?: string;
  expertise?: string;
  company?: string;
  source?: string;
};

export const DISCOVERY_SESSION_STORAGE_KEY = 'idehjo.discovery.session.v1';

const MAX_LENGTH = 120;
const CONTEXT_KEYS = ['query', 'role', 'expertise', 'company', 'source'] as const;

const clean = (value?: string | null) =>
  (value ?? '').trim().replace(/\s+/g, ' ').slice(0, MAX_LENGTH);

const normalize = (
  context: DiscoverySessionContext,
): DiscoverySessionContext => ({
  query: clean(context.query),
  role: clean(context.role),
  expertise: clean(context.expertise),
  company: clean(context.company),
  source: clean(context.source),
});

export function encodeDiscoveryContext(
  context: DiscoverySessionContext,
): string {
  const params = new URLSearchParams();
  const normalized = normalize(context);

  for (const key of CONTEXT_KEYS) {
    const value = normalized[key];
    if (value) params.set(key, value);
  }

  return params.toString();
}

export function decodeDiscoveryContext(
  input: string | URLSearchParams,
): DiscoverySessionContext | null {
  const searchParams =
    typeof input === 'string' ? new URLSearchParams(input) : input;

  const context = normalize({
    query: searchParams.get('query'),
    role: searchParams.get('role'),
    expertise: searchParams.get('expertise'),
    company: searchParams.get('company'),
    source: searchParams.get('source'),
  });

  const hasContext = CONTEXT_KEYS.some((key) => Boolean(context[key]));
  return hasContext ? context : null;
}

export function buildDiscoverySearchHref(
  query: string,
  context?: DiscoverySessionContext | null,
): string {
  const params = new URLSearchParams();
  const safeQuery = clean(query);

  if (safeQuery) params.set('q', safeQuery);

  if (context) {
    const encodedContext = encodeDiscoveryContext({
      ...context,
      query: safeQuery || context.query,
    });

    if (encodedContext) params.set('ctx', encodedContext);
  }

  const suffix = params.toString();
  return suffix ? `/search?${suffix}` : '/search';
}
