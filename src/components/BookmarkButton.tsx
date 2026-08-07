'use client';

import { Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';
import { me } from '@/lib/auth-client';

export function BookmarkButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    me().then((r) => {
      setEmail(r?.email ?? null);
      if (r?.email) {
        fetch('/api/bookmarks').then((x) => x.json()).then((j) => {
          setSaved((j.bookmarks ?? []).some((b: any) => b.slug === slug));
        });
      }
    });
  }, [slug]);

  const toggle = async () => {
    if (!email) { window.location.href = `/login?next=/product/${slug}`; return; }
    const res = await fetch('/api/bookmarks', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }),
    });
    const j = await res.json();
    if (res.ok) { setSaved(j.bookmarked); setMsg(''); }
    else setMsg(j.error ?? 'خطا');
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={toggle}
        title={saved ? 'حذف بوکمارک' : 'بوکمارک'}
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
          saved ? 'border-[#ff6154] bg-[#ff6154] text-white' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
        }`}
      >
        <Bookmark size={15} className={saved ? 'fill-white' : ''} />
      </button>
      {msg && <span className="max-w-[160px] text-[10px] font-bold leading-4 text-[#ff6154]">{msg}</span>}
    </div>
  );
}
