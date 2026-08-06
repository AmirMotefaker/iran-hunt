'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { me } from '@/lib/auth-client';

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    me().then((r) => setEmail(r?.email ?? null));
    fetch(`/api/likes?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((j) => { setCount(j.count ?? 0); setLiked(!!j.liked); });
  }, [slug]);

  const toggle = async () => {
    if (!email) {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    const j = await res.json();
    setCount(j.count ?? 0);
    setLiked(!!j.liked);
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
        liked ? 'bg-[#ff6154] text-white shadow' : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
      }`}
      title="لایک"
    >
      <Heart size={13} className={liked ? 'fill-white' : ''} />
      {count.toLocaleString('fa-IR')}
    </button>
  );
}
