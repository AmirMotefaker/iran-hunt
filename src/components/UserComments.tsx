'use client';

import { MessageCircle, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { me } from '@/lib/auth-client';

interface C { email: string; body: string; created_at: string; first_name: string; last_name: string; avatar: string; }

const fa = (iso: string) =>
  new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));

export function UserComments({ slug }: { slug: string }) {
  const [items, setItems] = useState<C[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = () =>
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((j) => setItems(j.items ?? []));

  useEffect(() => {
    me().then((r) => setEmail(r?.email ?? null));
    load();
  }, [slug]);

  const submit = async () => {
    setBusy(true); setError('');
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, body: text }),
    });
    const j = await res.json();
    if (res.ok) { setText(''); await load(); }
    else setError(j.error ?? 'خطا');
    setBusy(false);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <h4 className="flex items-center gap-2 font-extrabold text-gray-800">
        <MessageCircle size={17} className="text-[#ff6154]" /> نظرات کاربران ایده‌جو
      </h4>

      <ul className="mt-4 space-y-3">
        {items.length === 0 && <li className="text-sm text-gray-400">هنوز نظری ثبت نشده؛ اولین نفر باش!</li>}
        {items.map((c, i) => {
          const name = c.first_name || c.last_name ? `${c.first_name} ${c.last_name}`.trim() : c.email.split('@')[0];
          return (
            <li key={i} className="flex gap-3 rounded-2xl bg-gray-50 p-4">
              {c.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.avatar} alt={name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff6154]/10 text-sm font-black text-[#ff6154]">{name.slice(0, 1)}</span>
              )}
              <div className="min-w-0">
                <p className="text-xs font-black text-gray-700">{name} <span className="mr-2 font-medium text-gray-400">{fa(c.created_at)}</span></p>
                <p className="mt-1 text-sm leading-7 text-gray-600">{c.body}</p>
              </div>
            </li>
          );
        })}
      </ul>

      {email ? (
        <div className="mt-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="نظر خودت رو بنویس…"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
          />
          <button onClick={submit} disabled={busy || text.trim().length < 3} className="flex items-center gap-1.5 rounded-xl bg-[#ff6154] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">
            <Send size={14} /> ثبت
          </button>
        </div>
      ) : (
        <p className="mt-4 text-xs font-bold text-gray-400">برای ثبت نظر، ابتدا وارد شوید.</p>
      )}
      {error && <p className="mt-2 text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
}
