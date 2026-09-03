import Link from 'next/link';
import { loadCorpusProducts } from '@/lib/corpus';
import { buildTopicalAuthorityGraph, recommendInternalLinks } from '@/lib/topical-authority-graph';

export const dynamic = 'force-dynamic';

export default async function TopicalAuthorityPage() {
  const products = await loadCorpusProducts();
  const graph = buildTopicalAuthorityGraph(products);
  const nodeMap = new Map(graph.nodes.map((node) => [node.id, node]));
  const topHubs = graph.hubs.slice(0, 20);
  const sample = topHubs[0] ? recommendInternalLinks(graph, topHubs[0].nodeId, 8) : [];

  return (
    <main dir="rtl" className="mx-auto max-w-7xl px-5 py-8 md:py-12">
      <header className="rounded-[2rem] border border-black/10 bg-black p-7 text-white md:p-10">
        <p className="text-xs font-bold tracking-[0.18em] text-white/55">SEO + GEO KNOWLEDGE GRAPH</p>
        <h1 className="mt-3 text-3xl font-black md:text-5xl">گراف اعتبار موضوعی ایده‌جو</h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-white/65 md:text-base">
          ارتباط محصولات، موضوع‌ها، راهنماها و مقایسه‌ها فقط از داده و Surfaceهای واقعی ایده‌جو ساخته می‌شود؛ بدون محبوبیت یا تقاضای ساختگی.
        </p>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['گره‌ها', graph.nodes.length],
          ['روابط مستند', graph.edges.length],
          ['گره‌های یتیم', graph.orphanNodeIds.length],
          ['هاب‌های متصل', graph.hubs.length],
        ].map(([title, value]) => (
          <article key={title} className="rounded-3xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs text-black/45 dark:text-white/45">{title}</p>
            <p className="mt-2 text-3xl font-black">{Number(value).toLocaleString('fa-IR')}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-black/10 p-6 dark:border-white/10">
          <h2 className="text-2xl font-black">قوی‌ترین هاب‌ها</h2>
          <div className="mt-5 grid gap-3">
            {topHubs.map((hub) => {
              const node = nodeMap.get(hub.nodeId);
              if (!node) return null;
              return (
                <div key={hub.nodeId} className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 p-4 dark:border-white/10">
                  <div><p className="text-xs text-black/45 dark:text-white/45">{node.type}</p><p className="font-black">{node.label}</p></div>
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-black">{hub.degree.toLocaleString('fa-IR')} رابطه</span>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-[2rem] border border-black/10 p-6 dark:border-white/10">
          <h2 className="text-2xl font-black">گره‌های یتیم</h2>
          <p className="mt-2 text-sm text-black/55 dark:text-white/55">Surfaceهایی که هنوز هیچ رابطه معتبر در گراف ندارند.</p>
          <div className="mt-5 grid gap-3">
            {graph.orphanNodeIds.slice(0, 20).map((id) => {
              const node = nodeMap.get(id);
              return node ? <div key={id} className="rounded-2xl border border-black/10 p-4 text-sm font-bold dark:border-white/10">{node.label}</div> : null;
            })}
            {!graph.orphanNodeIds.length && <p className="text-sm text-black/55 dark:text-white/55">گره یتیمی شناسایی نشد.</p>}
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-[2rem] border border-black/10 p-6 dark:border-white/10 md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div><h2 className="text-2xl font-black">نمونه پیشنهاد لینک داخلی</h2><p className="mt-2 text-sm text-black/55 dark:text-white/55">پیشنهادهای مستقیم و درجه‌دو برای قوی‌ترین هاب فعلی.</p></div>
          <Link href="/admin/intent-coverage" className="text-sm font-bold underline underline-offset-4">گزارش پوشش نیت‌ها</Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {sample.map((node) => <span key={node.id} className="rounded-full bg-black/5 px-4 py-2 text-sm font-bold dark:bg-white/10">{node.label}</span>)}
        </div>
      </section>
    </main>
  );
}
