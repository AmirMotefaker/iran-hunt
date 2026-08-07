import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { hasPlan } from '@/lib/plans';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!hasPlan(user.plan, 'investor'))
    return NextResponse.json({ error: 'این بخش مخصوص پلن سرمایه‌گذار و بالاتر است' }, { status: 403 });

  const data = await loadLatest();
  if (!data) return NextResponse.json({ categories: [], signals: [] });

  const all: any[] = [...(data.periods.today ?? []), ...(data.periods.yesterday ?? []), ...(data.periods.week ?? []), ...(data.periods.month ?? []), ...(data.periods.year ?? [])];

  // رشد دسته‌ها: مجموع رأی در ماه/سال
  const catStats = new Map<string, { votes: number; count: number }>();
  for (const p of [...(data.periods.month ?? []), ...(data.periods.year ?? [])]) {
    for (const c of p.category.split('•').map((s: string) => s.trim()).filter(Boolean)) {
      const cur = catStats.get(c) ?? { votes: 0, count: 0 };
      cur.votes += p.votes; cur.count += 1;
      catStats.set(c, cur);
    }
  }
  const categories = [...catStats.entries()]
    .map(([name, s]) => ({ name, votes: s.votes, count: s.count }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 12);

  // سیگنال زودهنگام: رأی بالا ولی بدون تحلیل مشابه ایرانی قوی
  const signals = all
    .filter((p) => p.votes >= 400 && (!p.iranEquivalent || p.iranEquivalent.confidence < 60))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 10)
    .map((p) => ({ name: p.name, slug: p.slug, votes: p.votes, category: p.category }));

  return NextResponse.json({ categories, signals });
}
