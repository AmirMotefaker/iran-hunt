'use client';

import {
  Compass,
  Crown,
  Home,
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { logout, me } from '@/lib/auth-client';
import { CATEGORY_TREE, slugifyMainCategory } from '@/lib/categoryTree';
import { Logo } from './Logo';
import { useTheme } from './ThemeProvider';

function SearchBox({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [res, setRes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) {
      setRes([]);
      setOpen(false);
      return;
    }

    const t = setTimeout(async () => {
      const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const j = await r.json();
      setRes(j.results ?? []);
      setOpen(true);
    }, 250);

    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className={mobile ? 'relative w-full' : 'relative hidden lg:block'}>
      <Search
        size={16}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && q.trim().length >= 2) {
            e.preventDefault();
            setOpen(false);
            router.push(/search?q=);
          }
        }
        placeholder="جستجوی ایده یا محصول…"
        className={`w-full rounded-2xl border border-gray-200 bg-gray-50/80 py-2.5 pl-3 pr-10 text-sm text-gray-900 outline-none transition focus:border-[#ff6154] focus:bg-white focus:ring-4 focus:ring-[#ff6154]/10 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:focus:bg-gray-900 ${
          mobile ? '' : 'lg:w-64'
        }`}
      />

      {open && res.length > 0 && (
        <div className="absolute right-0 top-full z-[70] mt-2 w-full min-w-[280px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
          {res.slice(0, 7).map((r) => (
            <Link
              key={r.slug}
              href={`/product/${r.slug}`}
              onClick={() => {
                setOpen(false);
                setQ('');
              }}
              className="flex items-center gap-3 px-4 py-3 transition hover:bg-orange-50 dark:hover:bg-gray-900"
            >
              {r.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.thumbnail}
                  alt={r.name}
                  className="h-9 w-9 rounded-xl object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff6154]/10 text-sm font-black text-[#ff6154]">
                  {(r.name ?? '؟').slice(0, 1)}
                </span>
              )}

              <span
                className="min-w-0 flex-1 truncate text-sm font-extrabold text-gray-900 dark:text-gray-100"
                dir="ltr"
              >
                {r.name}
              </span>

              <span className="shrink-0 text-xs font-black text-[#ff6154]">
                {r.votes.toLocaleString('fa-IR')}
              </span>
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push(/search?q=);
            }}
            className="w-full border-t border-gray-100 px-4 py-3 text-center text-xs font-black text-[#ff6154] transition hover:bg-orange-50 dark:border-gray-800 dark:hover:bg-gray-900"
          >
            مشاهده همه نتایج جستجو ←
          </button>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [prof, setProf] = useState<{
    email: string;
    name: string;
    avatar: string;
  } | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeTimer = useRef<any>(null);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    setMobileOpen(false);

    (async () => {
      const u = await me();

      if (!u?.email) {
        setProf(null);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(!!u.isAdmin);

      try {
        const r = await fetch('/api/profile');

        if (r.ok) {
          const j = await r.json();
          const full = [j.profile.first_name, j.profile.last_name]
            .filter(Boolean)
            .join(' ');

          setProf({
            email: u.email,
            name: full || u.email,
            avatar: j.profile.avatar ?? '',
          });

          return;
        }
      } catch {}

      setProf({
        email: u.email,
        name: u.email,
        avatar: '',
      });
    })();
  }, [pathname]);

  const openMenu = () => {
    clearTimeout(closeTimer.current);
    setCatOpen(true);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setCatOpen(false), 220);
  };

  const doLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const navCls = (active: boolean) =>
    `flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-extrabold transition ${
      active
        ? 'bg-gray-950 text-white shadow-sm dark:bg-white dark:text-gray-950'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white'
    }`;

  const mobileLink =
    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold text-gray-800 transition hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-900';

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-2xl dark:border-white/5 dark:bg-[#09090b]/85">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <Logo size={36} />
              <span className="text-lg font-black tracking-tight text-gray-950 dark:text-white">
                ایده‌جو
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              <Link href="/" className={navCls(pathname === '/')}>
                <Home size={15} />
                خانه
              </Link>

              <div
                className="relative"
                onMouseEnter={openMenu}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (catOpen) setCatOpen(false);
                    else window.location.href = '/categories';
                  }}
                  className={navCls(
                    pathname.startsWith('/category') ||
                      pathname.startsWith('/main-category') ||
                      pathname === '/categories',
                  )}
                >
                  <LayoutGrid size={15} />
                  دسته‌بندی‌ها
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    className={`transition ${catOpen ? 'rotate-180' : ''}`}
                  >
                    <path
                      d="M2 3.5L5 6.5L8 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </button>

                {catOpen && (
                  <div className="absolute right-0 top-full z-50 pt-2">
                    <div className="grid w-[560px] grid-cols-2 gap-1 rounded-[24px] border border-gray-200/80 bg-white p-3 shadow-2xl shadow-black/10 dark:border-gray-800 dark:bg-gray-950">
                      {CATEGORY_TREE.map((c) => (
                        <Link
                          key={c.name}
                          href={`/main-category/${slugifyMainCategory(c.name)}`}
                          onClick={() => setCatOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-[#ff6154] dark:text-gray-200 dark:hover:bg-gray-900"
                        >
                          <span className="text-base">{c.icon}</span>
                          <span className="truncate font-extrabold">{c.fa}</span>
                        </Link>
                      ))}

                      <Link
                        href="/categories"
                        onClick={() => setCatOpen(false)}
                        className="col-span-2 mt-1 rounded-xl border-t border-gray-100 px-3 py-3 text-center text-xs font-black text-[#ff6154] dark:border-gray-800"
                      >
                        مشاهده همه دسته‌بندی‌ها ←
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/pricing" className={navCls(pathname === '/pricing')}>
                <Crown size={15} />
                پلن‌ها
              </Link>

              <Link href="/about" className={navCls(pathname === '/about')}>
                <Compass size={15} />
                درباره ما
              </Link>

              {isAdmin && (
                <Link
                  href="/crm"
                  className={navCls(pathname === '/crm')}
                >
                  <ShieldCheck size={15} />
                  مدیریت
                </Link>
              )}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <SearchBox />

            <button
              onClick={toggle}
              title={theme === 'dark' ? 'حالت روشن' : 'حالت تیره'}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden sm:block">
              {prof ? (
                <Link
                  href="/dashboard"
                  title={prof.name}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 py-1 pl-3 pr-1 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                >
                  {prof.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={prof.avatar}
                      alt={prof.name}
                      className="h-8 w-8 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff6154]/10 text-sm font-black text-[#ff6154]">
                      {prof.name.slice(0, 1)}
                    </span>
                  )}

                  <span className="hidden max-w-[110px] truncate text-xs font-bold text-gray-700 lg:block dark:text-gray-200">
                    {prof.name}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 dark:bg-white dark:text-gray-950"
                >
                  <User size={15} />
                  ورود
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-800 md:hidden dark:border-gray-800 dark:text-gray-100"
              aria-label="منوی موبایل"
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-[72px] z-40 border-b border-gray-200 bg-white/98 px-4 py-4 shadow-2xl backdrop-blur-2xl md:hidden dark:border-gray-800 dark:bg-[#09090b]/98">
          <div className="mx-auto max-w-xl space-y-3">
            <SearchBox mobile />

            <nav className="grid gap-1">
              <Link href="/" className={mobileLink}>
                <Home size={17} />
                خانه
              </Link>

              <Link href="/categories" className={mobileLink}>
                <LayoutGrid size={17} />
                دسته‌بندی‌ها
              </Link>

              <Link href="/pricing" className={mobileLink}>
                <Crown size={17} />
                پلن‌ها
              </Link>

              <Link href="/about" className={mobileLink}>
                <Compass size={17} />
                درباره ما
              </Link>

              {isAdmin && (
                <Link href="/crm" className={mobileLink}>
                  <ShieldCheck size={17} />
                  مدیریت
                </Link>
              )}
            </nav>

            <div className="border-t border-gray-100 pt-3 dark:border-gray-800">
              {prof ? (
                <div className="flex gap-2">
                  <Link
                    href="/dashboard"
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm font-extrabold text-gray-900 dark:bg-gray-900 dark:text-white"
                  >
                    <User size={16} />
                    حساب کاربری
                  </Link>

                  <button
                    onClick={doLogout}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-extrabold text-gray-700 dark:border-gray-800 dark:text-gray-300"
                  >
                    <LogOut size={15} />
                    خروج
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6154] px-4 py-3 text-sm font-black text-white"
                >
                  <User size={16} />
                  ورود / ثبت‌نام
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

