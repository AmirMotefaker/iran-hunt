export type PersonalizationProfile = {
  role?: string | null;
  expertise?: string | null;
  company?: string | null;
};

export type PersonalizationSavedProduct = {
  name?: string | null;
  category?: string | null;
  categoryFa?: string | null;
  faTagline?: string | null;
  tagline?: string | null;
};

export type PersonalizedDiscovery = {
  label: string;
  reason: string;
  query: string;
  source: 'saved' | 'profile' | 'fallback';
};

const clean = (value?: string | null) => value?.trim() ?? '';

const unique = (values: string[]) => {
  const seen = new Set<string>();
  return values.filter((value) => {
    const normalized = value.toLocaleLowerCase('fa-IR');
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
};

export function buildPersonalizedDiscovery(
  profile: PersonalizationProfile,
  savedProducts: PersonalizationSavedProduct[] = [],
): PersonalizedDiscovery[] {
  const expertise = clean(profile.expertise);
  const role = clean(profile.role);
  const company = clean(profile.company);

  const savedSignals = savedProducts
    .slice(0, 3)
    .map((product) => ({
      name: clean(product.name),
      context: clean(product.categoryFa)
        || clean(product.category)
        || clean(product.faTagline)
        || clean(product.tagline),
    }))
    .filter((item) => item.name || item.context);

  const items: PersonalizedDiscovery[] = [];

  if (savedSignals.length > 0) {
    const primary = savedSignals[0];
    const contexts = unique(savedSignals.map((item) => item.context).filter(Boolean));
    const query = unique([
      contexts[0] ?? '',
      expertise,
      role,
    ]).join(' ');

    items.push({
      label: primary.name ? `ادامه مسیر بعد از ${primary.name}` : 'ادامه مسیر ایده‌های ذخیره‌شده',
      reason: contexts[0]
        ? `بر اساس حوزه «${contexts[0]}» در ایده‌های ذخیره‌شده‌ات`
        : 'بر اساس ایده‌هایی که قبلاً برای بررسی دوباره ذخیره کرده‌ای',
      query: query || primary.name,
      source: 'saved',
    });
  }

  if (expertise) {
    items.push({
      label: `فرصت‌های تازه در ${expertise}`,
      reason: role
        ? `بر اساس تخصص «${expertise}» و نقش «${role}» در پروفایل تو`
        : `بر اساس تخصص «${expertise}» در پروفایل تو`,
      query: unique([expertise, role]).join(' '),
      source: 'profile',
    });
  }

  if (role) {
    items.push({
      label: `ایده‌های مناسب برای ${role}`,
      reason: company
        ? `بر اساس نقش حرفه‌ای تو و زمینه کاری «${company}»`
        : 'بر اساس نقش حرفه‌ای ثبت‌شده در پروفایل تو',
      query: unique([role, expertise, company]).join(' '),
      source: 'profile',
    });
  }

  if (items.length === 0) {
    items.push({
      label: 'ایده‌های تازه برای بررسی',
      reason: 'برای شروع مسیر کشف، از تازه‌ترین ایده‌های ایده‌جو استفاده کن',
      query: '',
      source: 'fallback',
    });
  }

  const seenQueries = new Set<string>();
  return items.filter((item) => {
    const key = item.query.toLocaleLowerCase('fa-IR');
    if (seenQueries.has(key)) return false;
    seenQueries.add(key);
    return true;
  }).slice(0, 3);
}

export function personalizedDiscoveryHref(query: string) {
  return query ? `/search?q=${encodeURIComponent(query)}` : '/products';
}
