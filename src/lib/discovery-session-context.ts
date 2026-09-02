export type DiscoverySessionContext = {
  query?: string;
  role?: string;
  expertise?: string;
  company?: string;
  source?: string;
};

const MAX_LENGTH = 120;

const clean = (value?: string) =>
  (value ?? '').trim().replace(/\s+/g, ' ').slice(0, MAX_LENGTH);

export function encodeDiscoveryContext(
  context: DiscoverySessionContext,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(context)) {
    const safe = clean(value);
    if (safe) params.set(key, safe);
  }

  return params.toString();
}

export function decodeDiscoveryContext(
  searchParams: URLSearchParams,
): DiscoverySessionContext {
  return {
    query: clean(searchParams.get('query') ?? undefined),
    role: clean(searchParams.get('role') ?? undefined),
    expertise: clean(searchParams.get('expertise') ?? undefined),
    company: clean(searchParams.get('company') ?? undefined),
    source: clean(searchParams.get('source') ?? undefined),
  };
}
