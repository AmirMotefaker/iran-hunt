'use client';

import { Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { me } from '@/lib/auth-client';
import { hasPlan, type PlanId } from '@/lib/plans';

export function AiReview({ text }: { text?: string }) {
  const [plan, setPlan] = useState<PlanId>('free');
  useEffect(() => { me().then((r) => setPlan((r?.plan as PlanId) ?? 'free')); }, []);

  if (!text) return null;

  if (!hasPlan(plan, 'pro')) {
    return (
      <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 text-center dark:border-purple-900/40 dark:bg-purple-950/20">
        <Sparkles size={22} className="mx-auto text-purple-500" />
        <h4 className="mt-3 font-extrabold text-purple-900 dark:text-purple-200">تحلیل تخصصی و فنی با هوش مصنوعی</h4>
        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-purple-800 dark:text-purple-300">
          بررسی عمیق معماری، مدل درآمدی، نقاط قوت و ضعف فنی این محصول — نوشته‌شده توسط AI.
        </p>
        <Link href="/pricing" className="mt-4 inline-flex rounded-2xl bg-purple-600 px-6 py-2.5 text-sm font-black text-white transition hover:bg-purple-700">
          باز کردن با پلن حرفه‌ای 🚀
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-900/40 dark:bg-purple-950/20">
      <h4 className="flex items-center gap-2 font-extrabold text-purple-900 dark:text-purple-200">
        <Sparkles size={18} /> تحلیل تخصصی و فنی با هوش مصنوعی
      </h4>
      <div className="mt-3 space-y-1 text-sm leading-8 text-purple-900 dark:text-purple-100">
        {text.split('\n').map((line, i) => {
          const t = line.trim();
          if (!t) return null;
          return t.startsWith('🔹') ? (
            <strong key={i} className="block pt-3 font-black text-purple-900 dark:text-purple-200">{t}</strong>
          ) : (
            <p key={i} className={t.startsWith('-') ? 'pr-5' : ''}>{t}</p>
          );
        })}
      </div>
    </div>
  );
}
