'use client';

import { Github, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { logout, me } from '@/lib/auth-client';

export function Header() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    me().then(setEmail);
  }, []);

  const doLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="IranHunt" className="h-9 w-9 rounded-xl" />
            <span className="text-xl font-black text-gray-900">
              IranHunt <span className="text-sm font-bold text-[#ff6154]">ایده‌یاب</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm font-bold text-gray-600 sm:flex">
            <Link href="/" className="hover:text-[#ff6154]">ایده‌های ترند</Link>
            <Link href="/#about" className="hover:text-[#ff6154]">درباره ما</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/AmirMotefaker"
            target="_blank"
            rel="noreferrer"
            title="GitHub من"
            className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100"
          >
            <Github size={20} />
          </a>

          {email ? (
            <div className="flex items-center gap-2">
              <span className="hidden max-w-[140px] truncate rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 sm:block" dir="ltr">
                {email}
              </span>
              <button onClick={doLogout} className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50">
                <LogOut size={14} /> خروج
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-1 rounded-xl bg-[#ff6154] px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-[#e5544a]">
              <User size={16} /> ورود / ثبت‌نام
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
