'use client';

import { Github, LayoutDashboard, LogOut, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout, me } from '@/lib/auth-client';
import { Logo } from './Logo';

const NAV = [
  { href: '/', label: 'خانه' },
  { href: '/categories', label: 'دسته‌بندی‌ها' },
  { href: '/about', label: 'درباره ما' },
];

export function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    me().then((r) => {
      setEmail(r?.email ?? null);
      setIsAdmin(!!r?.isAdmin);
    });
  }, []);

  const doLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={34} />
            <span className="text-lg font-black tracking-tight text-gray-900">ایده‌یاب</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3.5 py-2 text-sm font-bold transition ${
                  pathname === item.href ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {email && (
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition ${
                  pathname === '/dashboard' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard size={15} /> داشبورد
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/crm"
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition ${
                  pathname === '/crm' ? 'bg-[#ff6154] text-white' : 'text-[#ff6154] hover:bg-orange-50'
                }`}
              >
                <ShieldCheck size={15} /> CRM
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <a href="https://github.com/AmirMotefaker" target="_blank" rel="noreferrer" title="گیت‌هاب امیر متفکر" className="rounded-xl p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
            <Github size={19} />
          </a>
          {email ? (
            <button onClick={doLogout} className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-500 transition hover:bg-gray-50">
              <LogOut size={13} /> خروج
            </button>
          ) : (
            <Link href="/login" className="flex items-center gap-1.5 rounded-xl bg-[#ff6154] px-4 py-2 text-sm font-bold text-white shadow-sm shadow-orange-200 transition hover:bg-[#e5544a]">
              <User size={15} /> ورود / ثبت‌نام
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
