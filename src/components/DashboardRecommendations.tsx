'use client';

import { ArrowLeft, Bookmark, Sparkles, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  buildPersonalizedDiscovery,
  personalizedDiscoveryHref,
  type PersonalizedDiscovery,
} from '@/lib/dashboard-personalization';

export function DashboardRecommendations() {
  const pathname = usePathname();
  const [items, setItems] = useState<PersonalizedDiscovery[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname !== '/dashboard') {
      setReady(false);
      setItems([]);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const [profileRes, bookmarksRes] = await Promise.all([
          fetch('/api/profile', { cache: 'no-store' }),
          fetch('/api/bookmarks', { cache: 'no-store' }),
        ]);

        if (!profileRes.ok || !bookmarksRes.ok) return;

        const profileJson = await profileRes.json();
        const bookmarksJson = await bookmarksRes.json();

        if (cancelled) return;

        setItems(
          buildPersonalizedDiscovery(
            profileJson.profile ?? {},
            bookmarksJson.products ?? [],
          ),
        );
        setReady(true);
      } catch {
        if (!cancelled) setReady(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (pathname !== '/dashboard' || !ready || items.length === 0) return null;

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl px-4">
      <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 p-5 sm:p-6 dark:border-gray-800">
          <p className="flex items-center gap-2 text-xs font-black text-[#ff6154]">
            <Sparkles size={14} />
            پیشنهادهای شخصی شما
          </p>
          <h2 className="mt-2 text-xl font-black text-gray-950 dark:text-white">
            مسیر بعدی کشف بر اساس رفتار و پروفایل تو
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-500 dark:text-gray-400">
            این مسیرها از تخصص، نقش حرفه‌ای و حوزه ایده‌های ذخیره‌شده ساخته می‌شوند. دلیل هر پیشنهاد مشخص است و جستجو از همان موتور relevance ایده‌جو استفاده می‌کند.
          </p>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-6">
          {items.map((item) => (
            <Link
              key={`${item.source}-${item.label}-${item.query}`}
              href={personalizedDiscoveryHref(item.query)}
              className="group flex min-w-0 flex-col justify-between rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition hover:-translate-y-0.5 hover:border-[#ff6154]/25 hover:bg-white hover:shadow-lg dark:border-gray-800 dark:bg-gray-950/50 dark:hover:border-[#ff6154]/30 dark:hover:bg-gray-950"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-[10px] font-black text-gray-500 ring-1 ring-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-800">
                  {item.source === 'saved' ? <Bookmark size={11} /> : <UserRound size={11} />}
                  {item.source === 'saved' ? 'از ذخیره‌های تو' : item.source === 'profile' ? 'از پروفایل تو' : 'پیشنهاد عمومی'}
                </span>
                <h3 className="mt-3 text-sm font-black leading-7 text-gray-950 transition group-hover:text-[#ff6154] dark:text-white">
                  {item.label}
                </h3>
                <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  {item.reason}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-[#ff6154]">
                مشاهده پیشنهادها
                <ArrowLeft size={14} className="transition group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
