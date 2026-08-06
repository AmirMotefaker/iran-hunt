import { Database, Flame, Layers, Trophy } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const initialCategory = sp.cat;
  const data = await loadLatest();

  const all = data
    ? [...(data.periods.today ?? []), ...(data.periods.yesterday ?? []), ...(data.periods.week ?? []), ...(data.periods.month ?? [])]
    : [];
  const votes = all.reduce((s, p) => s + p.votes, 0);
  const cats = new Set(all.flatMap((p) => p.category.split('•').map((s) => s.trim()).filter(Boolean))).size;

  return (
    <main className="min-h-screen">
      {/* هیرو مینیمال با تایپوگرافی بزرگ */}
      <section className="mx-auto max-w-4xl px-4 pb-4 pt-16 text-center sm:pt-24">
        <span className="fade-up inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-bold text-gray-500 shadow-sm">
          🚀 پلتفرم هوشمند ایده‌یابی استارتاپی
        </span>
        <h1 className="fade-up-1 mt-6 text-4xl font-black leading-[1.35] tracking-tight text-gray-900 sm:text-6xl sm:leading-[1.3]">
          ایده‌های ترند جهان،
          <br />
          <span className="text-[#ff6154]">به زبان فارسی</span>
        </h1>
        <p className="fade-up-2 mx-auto mt-5 max-w-2xl text-sm leading-8 text-gray-500 sm:text-base">
          هر روز ۱۰ ایده برتر جهانی در ۴ بازه زمانی — با رتبه‌بندی واقعی، ترجمه
          روان، نظرات جامعه و تحلیل هوش مصنوعی از مشابه ایرانی هر ایده.
        </p>

        <div className="fade-up-3 mx-auto mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <Trophy size={17} className="mx-auto text-amber-500" />
            <p className="mt-2 text-lg font-black text-gray-900">{all.length.toLocaleString('fa-IR')}</p>
            <p className="text-[11px] font-bold text-gray-400">ایده تحلیل‌شده</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <Flame size={17} className="mx-auto text-[#ff6154]" />
            <p className="mt-2 text-lg font-black text-gray-900">{votes.toLocaleString('fa-IR')}</p>
            <p className="text-[11px] font-bold text-gray-400">رأی واقعی</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <Layers size={17} className="mx-auto text-indigo-500" />
            <p className="mt-2 text-lg font-black text-gray-900">{cats.toLocaleString('fa-IR')}</p>
            <p className="text-[11px] font-bold text-gray-400">دسته‌بندی</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <Database size={17} className="mx-auto text-emerald-500" />
            <p className="mt-2 text-lg font-black text-gray-900">۴</p>
            <p className="text-[11px] font-bold text-gray-400">بازه زمانی</p>
          </div>
        </div>
      </section>

      {data ? (
        <Dashboard data={data} initialCategory={initialCategory} />
      ) : (
        <section className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
            <p className="text-xl font-bold">🔍 هنوز داده‌ای ثبت نشده!</p>
          </div>
        </section>
      )}
    </main>
  );
}
