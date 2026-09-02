export type RecommendationProfile = {
  role?: string | null;
  expertise?: string | null;
  company?: string | null;
};

export type SavedProductContext = {
  name?: string | null;
  faTagline?: string | null;
  tagline?: string | null;
  tags?: string[] | null;
};

export type DashboardRecommendation = {
  label: string;
  reason: string;
  query: string;
};

const clean = (value?: string | null) => value?.trim() ?? '';

export function buildDashboardRecommendations(
  profile: RecommendationProfile,
  savedProducts: SavedProductContext[] = [],
): DashboardRecommendation[] {
  const expertise = clean(profile.expertise);
  const role = clean(profile.role);
  const company = clean(profile.company);
  const latestSaved = savedProducts[0];
  const savedName = clean(latestSaved?.name);
  const savedTag = clean(latestSaved?.tags?.[0]);
  const savedContext = savedTag || clean(latestSaved?.faTagline) || clean(latestSaved?.tagline);

  const candidates: DashboardRecommendation[] = [];

  if (expertise) {
    candidates.push({
      label: `فرصت‌های مرتبط با ${expertise}`,
      reason: 'بر اساس تخصصی که در پروفایل ثبت کرده‌ای',
      query: [expertise, role].filter(Boolean).join(' '),
    });
  }

  if (savedName) {
    candidates.push({
      label: `مشابه ${savedName}`,
      reason: 'بر اساس یکی از ایده‌هایی که قبلاً ذخیره کرده‌ای',
      query: [savedContext, expertise].filter(Boolean).join(' ') || savedName,
    });
  }

  if (role) {
    candidates.push({
      label: `برای ${role}`,
      reason: 'بر اساس نقش حرفه‌ای تو در ایده‌جو',
      query: [role, expertise, company].filter(Boolean).join(' '),
    });
  }

  if (candidates.length === 0) {
    candidates.push({
      label: 'ایده‌های تازه برای بررسی',
      reason: 'برای شروع دوباره مسیر کشف ایده‌ها',
      query: '',
    });
  }

  const seen = new Set<string>();
  return candidates.filter((item) => {
    const key = item.query.toLocaleLowerCase('fa-IR');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 3);
}

export function recommendationHref(query: string) {
  return query ? `/search?q=${encodeURIComponent(query)}` : '/products';
}
