'use client';

import { useEffect, useState } from 'react';
import { me } from '@/lib/auth-client';
import { faDigits } from '@/lib/plans';

export function StarRating({ slug }: { slug: string }) {
  const [avg, setAvg] = useState(0);
  const [total, setTotal] = useState(0);
  const [my, setMy] = useState(0);
  const [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    me().then((r) => setEmail(r?.email ?? null));
    fetch(`/api/ratings?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((j) => { setAvg(j.avg); setTotal(j.total); setMy(j.myRating); });
  }, [slug]);

  const rate = async (v: number) => {
    if (!email) { window.location.href = `/login?next=/product/${slug}`; return; }
    setBusy(true);
    const res = await fetch('/api/ratings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, rating: v }),
    });
    if (res.ok) { const j = await res.json(); setAvg(j.avg); setTotal(j.total); setMy(j.myRating); }
    setBusy(false);
  };

  const faAvg = faDigits(avg.toFixed(1));

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1" dir="rtl">
        {[1, 2, 3, 4, 5].map((v) => {
          const filled = v <= (hover || my);
          return (
            <button key={v} type="button" disabled={busy} onMouseEnter={() => setHover(v)} onMouseLeave={() => setHover(0)} onClick={() => rate(v)} className="transition hover:scale-110 disabled:cursor-wait" title={`امتیاز ${faDigits(v)}`}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill={filled ? '#f59e0b' : 'none'} stroke={filled ? '#f59e0b' : '#cbd5e1'} strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round" strokeLinecap="round"/>
              </svg>
            </button>
          );
        })}
      </div>
      <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
        {avg > 0 ? (
          <span>
            <span className="text-amber-500">{faAvg}</span> از {faDigits(5)} · {faDigits(total)} امتیاز
            {my > 0 && <span className="mr-2 text-[#ff6154]">(امتیاز شما: {faDigits(my)})</span>}
          </span>
        ) : (
          <span>اولین نفری باش که امتیاز میده</span>
        )}
      </div>
    </div>
  );
}
