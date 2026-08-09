// تمام لینک‌های خروجی با UTM ایده‌جو — بدون ref محصولهانگت
export function withUtm(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete('ref');
    u.searchParams.delete('referral');
    u.searchParams.delete('utm_source');
    u.searchParams.set('utm_source', 'idehjo.ir');
    u.searchParams.set('utm_medium', 'referral');
    u.searchParams.set('utm_campaign', 'idehjo');
    return u.toString();
  } catch {
    return url;
  }
}
