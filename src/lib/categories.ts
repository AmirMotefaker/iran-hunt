import { extractSlug } from '@/lib/slug';
import { loadLatest } from '@/lib/storage';

export async function getAllCategories() {
  const data = await loadLatest();
  const counts = new Map<string, number>();
  if (data) {
    for (const key of ['today', 'yesterday', 'week', 'month', 'year'] as const) {
      for (const p of (data.periods as any)[key] ?? []) {
        for (const c of p.category.split('•').map((s: string) => s.trim()).filter(Boolean)) {
          counts.set(c, (counts.get(c) ?? 0) + 1);
        }
      }
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
}

export function slugifyCategory(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '');
}
