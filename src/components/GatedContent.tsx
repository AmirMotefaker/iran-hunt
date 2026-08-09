'use client';

import { Download, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { me } from '@/lib/auth-client';
import type { Product } from '@/types';
import { withUtm } from '@/lib/utm';

export function GatedContent({ product }: { product: Product }) {
  const [plan, setPlan] = useState<string>('free');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    me().then((r) => { setPlan(r?.plan ?? 'free'); setLoaded(true); });
  }, []);

  const unlocked = plan !== 'free';

  const exportCsv = () => {
    const rows = [
      ['نام', product.name],
      ['تگلاین', product.tagline],
      ['رأی', String(product.votes)],
      ['دسته‌بندی', product.category],
      ['وب‌سایت', product.websiteUrl],
      ['توضیحات', product.description],
      ['توضیح فارسی', product.faDescription ?? ''],
      ['مشابه ایرانی', product.iranEquivalent?.productName ?? ''],
    ];
    const csv = '\uFEFF' + rows.map((r) => r.map((c) => `"${(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${product.slug}.csv`;
    a.click();
  };

  if (unlocked) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900/40 dark:bg-green-950/20">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-2 font-extrabold text-green-900 dark:text-green-200">
              <Sparkles size={18} /> توضیحات کامل و تکمیلی
            </h4>
            <button onClick={exportCsv} className="flex items-center gap-1 rounded-xl bg-green-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-green-700">
              <Download size={13} /> خروجی CSV
            </button>
          </div>
          <div className="mt-3 space-y-3 text-sm leading-8 text-green-900 dark:text-green-100">
            {product.description && (
              <p dir="ltr" className="rounded-xl border border-green-200/50 bg-white/50 p-3 dark:border-green-900/30 dark:bg-gray-900/50">{product.description}</p>
            )}
            {product.longDescription && product.longDescription !== product.description && (
              <p dir="ltr" className="rounded-xl border border-green-200/50 bg-white/50 p-3 dark:border-green-900/30 dark:bg-gray-900/50">{product.longDescription}</p>
            )}
            {product.faDescription && (
              <p className="rounded-xl border border-green-200/50 bg-white/50 p-3 dark:border-green-900/30 dark:bg-gray-900/50">🇮🇷 {product.faDescription}</p>
            )}
            {product.maker && (
              <p className="rounded-xl border border-green-200/50 bg-white/50 p-3 dark:border-green-900/30 dark:bg-gray-900/50">
                👤 <b>سازنده:</b> {product.maker} {product.makerTitle && `— ${product.makerTitle}`}
              </p>
            )}
          </div>
        </div>
        {product.websiteUrl && (
          <a href={withUtm(product.websiteUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700">
            🌐 وب‌سایت رسمی محصول
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800/50">
      <Lock size={22} className="mx-auto text-[#ff6154]" />
      <h4 className="mt-3 font-extrabold text-gray-800 dark:text-white">توضیحات کامل، وب‌سایت رسمی و تحلیل مشابه ایرانی</h4>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-600 dark:text-gray-300">
        {loaded ? 'این بخش مخصوص پلن‌های پولی است. با پلن حرفه‌ای، قفل تمام ایده‌ها باز می‌شود.' : '...'}
      </p>
      <Link href="/pricing" className="mt-4 inline-flex rounded-2xl bg-[#ff6154] px-6 py-2.5 text-sm font-black text-white shadow transition hover:bg-[#e5544a]">
        مشاهده پلن‌ها و ارتقا 🚀
      </Link>
    </div>
  );
}
