'use client';

import { Compass, Crown, Home, LayoutGrid, LogOut, Moon, ShieldCheck, Sun, TrendingUp, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { logout, me } from '@/lib/auth-client';
import { CATEGORY_TREE, slugifyMainCategory } from '@/lib/categoryTree';
import { Logo } from './Logo';
import { useTheme } from './ThemeProvider';

export function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const closeTimer = useRef<any>(null);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    me().then((r) => {
      if (r) { setEmail(r.email); setIsAdmin(!!r.isAdmin); }
    });
  }, []);

  const openMenu = () => { clearTimeout(closeTimer.current); setCatOpen(true); };
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setCatOpen(false), 250); };
  const doLogout = async () => { await logout(); window.location.href = '/'; };

  const navCls = (active: boolean) =>
    `flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition ${
      active ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={34} />
            <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white">ایده‌جو</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/" className={navCls(pathname === '/')}>
              <Home size={15} /> خانه
            </Link>

            <div className="relative" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
              <button type="button" onClick={() => { if (catOpen) setCatOpen(false); else window.location.href = '/categories'; }} className={navCls(pathname.startsWith('/category') || pathname.startsWith('/main-category') || pathname === '/categories')}>
                <LayoutGrid size={15} /> دسته‌بندی‌ها
                <svg width="10" height="10" viewBox="0 0 10 10" className={`transition ${catOpen ? 'rotate-180' : ''}`}><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
              </button>
              {catOpen && (
                <div className="absolute right-0 top-full z-50 pt-1">
                  <div className="grid w-[520px] grid-cols-2 gap-1 rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
                    {CATEGORY_TREE.map((c) => (
                      <Link key={c.name} href={`/main-category/${slugifyMainCategory(c.name)}`} onClick={() => setCatOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-[#ff6154] dark:text-gray-200 dark:hover:bg-gray-800">
                        <span className="text-base">{c.icon}</span>
                        <span className="truncate font-bold">{c.fa}</span>
                      </Link>
                    ))}
                    <Link href="/categories" onClick={() => setCatOpen(false)} className="col-span-2 mt-1 rounded-xl border-t border-gray-200 px-3 py-2.5 text-center text-xs font-bold text-[#ff6154] dark:border-gray-700">
                      مشاهده همه دسته‌بندی‌ها ←
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/pricing" className={navCls(pathname === '/pricing')}>
              <Crown size={15} /> پلن‌ها
            </Link>
            <Link href="/about" className={navCls(pathname === '/about')}>
              <Compass size={15} /> درباره ما
            </Link>
            {email && (
              <Link href="/dashboard" className={navCls(pathname === '/dashboard')}>
                <TrendingUp size={15} /> داشبورد من
              </Link>
            )}
            {isAdmin && (
              <Link href="/crm" className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition ${pathname === '/crm' ? 'bg-[#ff6154] text-white' : 'text-[#ff6154] hover:bg-orange-50 dark:hover:bg-orange-900/20'}`}>
                <ShieldCheck size={15} /> CRM
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggle} title={theme === 'dark' ? 'حالت روشن' : 'حالت تیره'} className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {email ? (
            <button onClick={doLogout} className="flex items-center gap-1 rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
              <LogOut size={13} /> خروج
            </button>
          ) : (
            <Link href="/login" className="flex items-center gap-1.5 rounded-xl bg-[#ff6154] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#e5544a]">
              <User size={15} /> ورود / ثبت‌نام
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
