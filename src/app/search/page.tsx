"use client";

import { Search, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SearchResult = {
  slug: string;
  name?: string;
  tagline?: string;
  votes?: number;
  thumbnail?: string;
};

export default function SearchPage() {
  const router = useRouter();`n  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const q = initialQuery.trim();

    if (q.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(q)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const data = await response.json();

        if (!cancelled) {
          setResults(data.results ?? []);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [initialQuery]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const q = query.trim();

    if (q.length < 2) return;

    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <main className="min-h-[70vh]">
      <section className="border-b border-gray-200/70 bg-gradient-to-b from-orange-50/70 to-white px-4 py-14 dark:border-gray-800 dark:from-orange-950/20 dark:to-gray-950 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-black text-[#ff6154] shadow-sm dark:border-orange-900/50 dark:bg-gray-900">
            <Sparkles size={14} />
            جستجوی هوشمند ایده‌جو
          </div>

          <h1 className="max-w-3xl text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
            ایده‌ای که دنبالش هستی را پیدا کن
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-8 text-gray-600 dark:text-gray-400 sm:text-base">
            در آرشیو تاریخی ایده‌جو میان محصولات، ایده‌ها و ترندهای ثبت‌شده
            جستجو کن.
          </p>

          <form
            onSubmit={submitSearch}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
                placeholder="نام محصول، ایده یا موضوع..."
                className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-4 pr-12 text-sm font-bold text-gray-950 outline-none transition focus:border-[#ff6154] focus:ring-4 focus:ring-[#ff6154]/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="h-14 rounded-2xl bg-[#ff6154] px-7 text-sm font-black text-white shadow-lg shadow-[#ff6154]/20 transition hover:-translate-y-0.5 hover:bg-[#f45144]"
            >
              جستجو
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        {initialQuery.trim().length < 2 ? (
          <div className="rounded-[28px] border border-dashed border-gray-300 bg-gray-50/70 px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900/50">
            <Search className="mx-auto text-gray-400" size={30} />
            <h2 className="mt-4 text-lg font-black text-gray-900 dark:text-white">
              عبارت جستجو را وارد کن
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              حداقل دو کاراکتر برای شروع جستجو لازم است.
            </p>
          </div>
        ) : loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-3xl bg-gray-100 dark:bg-gray-900"
              />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-[28px] border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-800 dark:bg-gray-950">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff6154]/10 text-[#ff6154]">
              <Search size={24} />
            </div>
            <h2 className="mt-5 text-xl font-black text-gray-900 dark:text-white">
              نتیجه‌ای پیدا نشد
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-500">
              عبارت دیگری را امتحان کن یا نام یک محصول مشخص را جستجو کن.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 text-sm font-black text-white dark:bg-white dark:text-gray-950"
            >
              مشاهده آرشیو کامل
              <ArrowLeft size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black text-[#ff6154]">
                  نتایج جستجو
                </p>
                <h2 className="mt-1 text-xl font-black text-gray-950 dark:text-white sm:text-2xl">
                  «{initialQuery}»
                </h2>
              </div>

              <span className="shrink-0 text-xs font-bold text-gray-500">
                {results.length.toLocaleString("fa-IR")} نتیجه
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((result) => (
                <Link
                  key={result.slug}
                  href={`/product/${result.slug}`}
                  className="group flex min-w-0 gap-4 rounded-3xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#ff6154]/40 hover:shadow-xl hover:shadow-black/5 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-[#ff6154]/40"
                >
                  {result.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={result.thumbnail}
                      alt={result.name ?? ""}
                      className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#ff6154]/10 text-2xl font-black text-[#ff6154]">
                      {(result.name ?? "؟").slice(0, 1)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div
                      dir="ltr"
                      className="truncate text-base font-black text-gray-950 group-hover:text-[#ff6154] dark:text-white"
                    >
                      {result.name}
                    </div>

                    <p className="mt-2 line-clamp-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
                      {result.tagline || "محصول ثبت‌شده در آرشیو ایده‌جو"}
                    </p>

                    <div className="mt-2 text-xs font-black text-[#ff6154]">
                      {(result.votes ?? 0).toLocaleString("fa-IR")} رأی
                    </div>
                  </div>

                  <ArrowLeft
                    size={17}
                    className="mt-1 shrink-0 text-gray-300 transition group-hover:-translate-x-1 group-hover:text-[#ff6154]"
                  />
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
