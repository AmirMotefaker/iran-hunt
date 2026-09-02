'use client';

import {
  ArrowLeft,
  Bell,
  Bookmark,
  Camera,
  Compass,
  Crown,
  Heart,
  MessageCircle,
  RefreshCw,
  Save,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { me } from '@/lib/auth-client';
import { CITIES } from '@/lib/cities';
import { PROVINCES } from '@/lib/provinces';
import { PLANS } from '@/lib/plans';

const faFull = (iso: string) => {
  const d = new Date(iso);
  const dayName = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(d);
  const date = new Intl.DateTimeFormat('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  const time = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
  return `${dayName}، ${date}، ساعت ${time}`;
};

const inputCls = 'w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white';
const labelCls = 'mb-1 block text-xs font-bold text-gray-500 dark:text-gray-400';
type DashboardState = 'checking-auth' | 'loading-dashboard' | 'ready' | 'error';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [plan, setPlan] = useState('free');
  const [expires, setExpires] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [bookmarkProducts, setBookmarkProducts] = useState<any[]>([]);
  const [alerts, setAlerts] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', province: '', city: '', mobile: '', avatar: '', company: '', role: '', expertise: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [loadState, setLoadState] = useState<DashboardState>('checking-auth');
  const [loadError, setLoadError] = useState('');
  const [activationDismissed, setActivationDismissed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadDashboard = useCallback(async () => {
    setLoadError('');
    setLoadState('checking-auth');
    setProfile(null);

    try {
      const u = await me();

      if (!u?.email) {
        window.location.replace('/login?next=/dashboard');
        return;
      }

      setPlan(u.plan ?? 'free');
      setExpires(u.planExpiresAt ?? null);
      setLoadState('loading-dashboard');

      const profileRes = await fetch('/api/profile', { cache: 'no-store' });

      if (profileRes.status === 401) {
        window.location.replace('/login?next=/dashboard');
        return;
      }

      if (!profileRes.ok) {
        throw new Error('profile');
      }

      const j = await profileRes.json();

      if (!j?.profile) {
        throw new Error('profile');
      }

      setProfile(j.profile);
      setLikes(j.likes ?? 0);
      setComments(j.comments ?? 0);
      setAlerts(!!j.profile.alerts);
      setForm({
        first_name: j.profile.first_name ?? '', last_name: j.profile.last_name ?? '',
        province: j.profile.province ?? '', city: j.profile.city ?? '',
        mobile: j.profile.mobile ?? '', avatar: j.profile.avatar ?? '',
        company: j.profile.company ?? '', role: j.profile.role ?? '', expertise: j.profile.expertise ?? '',
      });

      const bookmarkRes = await fetch('/api/bookmarks', { cache: 'no-store' });

      if (bookmarkRes.status === 401) {
        window.location.replace('/login?next=/dashboard');
        return;
      }

      if (!bookmarkRes.ok) {
        throw new Error('bookmarks');
      }

      const b = await bookmarkRes.json();
      setBookmarks(b.bookmarks ?? []);
      setBookmarkProducts(b.products ?? []);
      setLoadState('ready');
    } catch {
      setLoadError('بارگذاری داشبورد کامل نشد. اتصال را بررسی کن و دوباره تلاش کن.');
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const onFile = (f: File | null) => {
    if (!f) return;
    if (f.size > 300 * 1024) { setMsg('حجم تصویر باید کمتر از ۳۰۰ کیلوبایت باشد'); return; }
    const reader = new FileReader();
    reader.onload = () => setForm((s) => ({ ...s, avatar: String(reader.result) }));
    reader.readAsDataURL(f);
  };

  const save = async () => {
    setBusy(true); setMsg('');
    const res = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const j = await res.json();
    setMsg(res.ok ? '✅ پروفایل با موفقیت ذخیره شد' : j.error ?? 'خطا');
    if (res.ok) setProfile((current: any) => ({ ...current, ...form }));
    setBusy(false);
  };

  const toggleAlerts = async () => {
    const next = !alerts;
    setAlerts(next);
    await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, alerts: next }) });
  };

  if (loadState === 'checking-auth' || loadState === 'loading-dashboard') {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#ff6154] dark:border-gray-800 dark:border-t-[#ff6154]" />
        <p className="mt-4 text-sm font-bold text-gray-500 dark:text-gray-400">
          {loadState === 'checking-auth' ? 'در حال بررسی ورود…' : 'در حال آماده‌سازی داشبورد…'}
        </p>
      </main>
    );
  }

  if (loadState === 'error' || !profile) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <section className="rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff6154]/10 text-[#ff6154]">
            <RefreshCw size={22} />
          </div>
          <h1 className="mt-4 text-xl font-black text-gray-950 dark:text-white">داشبورد کامل بارگذاری نشد</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-500 dark:text-gray-400">
            {loadError || 'یک خطای موقت در بارگذاری اطلاعات حساب رخ داد.'}
          </p>
          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ff6154] px-5 text-sm font-black text-white transition hover:bg-[#e5544a]"
            >
              <RefreshCw size={15} />
              تلاش دوباره
            </button>
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 px-5 text-sm font-black text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              بازگشت به ایده‌ها
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const planDef = PLANS.find((p) => p.id === plan)!;
  const activationComplete = Boolean(form.role.trim() && form.expertise.trim());
  const discoveryQuery = [form.expertise, form.role, form.company]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(' ');
  const personalizedHref = discoveryQuery
    ? `/search?q=${encodeURIComponent(discoveryQuery)}`
    : '/products';

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <section className="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {form.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.avatar}
                  alt="پروفایل"
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-black/5 dark:ring-white/10"
                />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#ff6154]/10 text-xl font-black text-[#ff6154]">
                  {(form.first_name || profile.email).slice(0, 1)}
                </span>
              )}

              <div className="min-w-0">
                <p className="text-xs font-black text-[#ff6154]">
                  فضای شخصی ایده‌جو
                </p>

                <h1 className="mt-1 truncate text-2xl font-black text-gray-950 dark:text-white">
                  {form.first_name
                    ? `${form.first_name}${form.last_name ? ` ${form.last_name}` : ''}`
                    : 'داشبورد من'}
                </h1>

                <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  عضو ایده‌جو از {faFull(profile.created_at)}
                </p>
              </div>
            </div>

            <Link
              href="/products"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ff6154] px-5 text-sm font-black text-white transition hover:bg-[#e5544a]"
            >
              <Compass size={16} />
              ادامه کشف ایده‌ها
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-gray-100 dark:border-gray-800">
          <div className="p-4 text-center">
            <Heart size={16} className="mx-auto text-[#ff6154]" />
            <p className="mt-1.5 text-lg font-black text-gray-950 dark:text-white">
              {likes.toLocaleString('fa-IR')}
            </p>
            <p className="text-[10px] font-bold text-gray-400">لایک</p>
          </div>

          <div className="border-x border-gray-100 p-4 text-center dark:border-gray-800">
            <Bookmark size={16} className="mx-auto text-amber-500" />
            <p className="mt-1.5 text-lg font-black text-gray-950 dark:text-white">
              {bookmarks.length.toLocaleString('fa-IR')}
            </p>
            <p className="text-[10px] font-bold text-gray-400">ذخیره‌شده</p>
          </div>

          <div className="p-4 text-center">
            <MessageCircle size={16} className="mx-auto text-indigo-500" />
            <p className="mt-1.5 text-lg font-black text-gray-950 dark:text-white">
              {comments.toLocaleString('fa-IR')}
            </p>
            <p className="text-[10px] font-bold text-gray-400">نظر</p>
          </div>
        </div>
      </section>

      {!activationComplete && !activationDismissed ? (
        <section className="relative mt-8 overflow-hidden rounded-[28px] border border-[#ff6154]/25 bg-[#ff6154]/5 p-5 sm:p-7 dark:border-[#ff6154]/25 dark:bg-[#ff6154]/10">
          <button
            type="button"
            onClick={() => setActivationDismissed(true)}
            className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-white hover:text-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-200"
            aria-label="فعلاً بعداً"
          >
            <X size={17} />
          </button>

          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-black text-[#ff6154]">
              <Target size={15} />
              فعال‌سازی تجربه شخصی
            </p>
            <h2 className="mt-2 text-2xl font-black text-gray-950 dark:text-white">
              ایده‌جو بداند دنبال چه فرصت‌هایی هستی
            </h2>
            <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
              فقط سمت و تخصصت را مشخص کن تا از همین جستجو و دسته‌بندی‌های موجود، مسیر کشف مرتبط‌تری برایت بسازیم. این مرحله اجباری نیست و هر زمان خواستی قابل تغییر است.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>سمت</label>
              <input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="مثلاً بنیان‌گذار"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>تخصص</label>
              <input
                value={form.expertise}
                onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                placeholder="مثلاً هوش مصنوعی"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>شرکت / استارتاپ اختیاری</label>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="اختیاری"
                className={inputCls}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => void save()}
              disabled={busy || !form.role.trim() || !form.expertise.trim()}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ff6154] px-5 text-sm font-black text-white transition hover:bg-[#e5544a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Save size={15} />
              ذخیره و شخصی‌سازی
            </button>
            <button
              type="button"
              onClick={() => setActivationDismissed(true)}
              className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-xs font-black text-gray-500 transition hover:bg-white dark:text-gray-300 dark:hover:bg-gray-900"
            >
              فعلاً بعداً
            </button>
          </div>
        </section>
      ) : activationComplete ? (
        <section className="mt-8 flex flex-col gap-5 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-black text-[#ff6154]">
              <Target size={14} />
              پیشنهاد برای تو
            </p>
            <h2 className="mt-2 text-lg font-black text-gray-950 dark:text-white">
              کشف فرصت‌های مرتبط با {form.expertise}
            </h2>
            <p className="mt-1 text-sm leading-7 text-gray-500 dark:text-gray-400">
              بر اساس تخصص «{form.expertise}» و نقش «{form.role}»، جستجوی مرتبط را ادامه بده و گزینه‌های مناسب برای بررسی بعدی را ذخیره کن.
            </p>
          </div>
          <Link
            href={personalizedHref}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 text-sm font-black text-white transition hover:bg-[#ff6154] dark:bg-white dark:text-gray-950 dark:hover:bg-[#ff6154] dark:hover:text-white"
          >
            کشف مرتبط با من
            <ArrowLeft size={15} />
          </Link>
        </section>
      ) : null}

      {/* ذخیره‌شده‌ها */}
      <section className="mt-8 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-100 p-5 sm:p-6 dark:border-gray-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-black text-[#ff6154]">
                <Sparkles size={14} />
                کشف ذخیره‌شده
              </p>

              <h2 className="mt-2 text-xl font-black text-gray-950 dark:text-white">
                ایده‌هایی که برای بعد نگه داشتی
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-7 text-gray-500 dark:text-gray-400">
                محصولات ذخیره‌شده‌ات را از همین‌جا دوباره بررسی کن و مسیر تحقیق را ادامه بده.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-xs font-black text-white transition hover:bg-[#ff6154] dark:bg-white dark:text-gray-950 dark:hover:bg-[#ff6154] dark:hover:text-white"
            >
              <Compass size={14} />
              کشف ایده‌های بیشتر
            </Link>
          </div>
        </div>

        {bookmarkProducts.length > 0 ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
            {bookmarkProducts.map((product) => {
              const description =
                product.faDescription ??
                product.faTagline ??
                product.tagline ??
                '';

              return (
                <Link
                  key={product.slug}
                  href={`/product/${product.slug}`}
                  className="group flex min-w-0 gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition hover:-translate-y-0.5 hover:border-[#ff6154]/25 hover:bg-white hover:shadow-lg dark:border-gray-800 dark:bg-gray-950/50 dark:hover:border-[#ff6154]/30 dark:hover:bg-gray-950"
                >
                  {product.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="h-16 w-16 shrink-0 rounded-2xl border border-black/5 object-cover dark:border-white/10"
                    />
                  ) : (
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#ff6154]/10 text-xl font-black text-[#ff6154]">
                      {(product.name ?? '؟').slice(0, 1)}
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className="truncate text-base font-black text-gray-950 transition group-hover:text-[#ff6154] dark:text-white"
                        dir="ltr"
                      >
                        {product.name}
                      </h3>

                      <ArrowLeft
                        size={15}
                        className="mt-1 shrink-0 text-gray-300 transition group-hover:-translate-x-1 group-hover:text-[#ff6154]"
                      />
                    </div>

                    {description && (
                      <p className="mt-1.5 line-clamp-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
                        {description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-[#ff6154]/10 px-2 py-1 text-[10px] font-black text-[#ff6154]">
                        {(product.votes ?? 0).toLocaleString('fa-IR')} رأی
                      </span>

                      <span className="rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        ذخیره‌شده
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-12 text-center sm:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-950/30">
              <Bookmark size={23} />
            </div>

            <h3 className="mt-4 text-lg font-black text-gray-900 dark:text-white">
              هنوز ایده‌ای ذخیره نکردی
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-500 dark:text-gray-400">
              هر محصولی که ارزش بررسی دوباره دارد را بوکمارک کن تا اینجا همیشه در دسترس باشد.
            </p>

            <Link
              href="/products"
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ff6154] px-5 text-sm font-black text-white transition hover:bg-[#e5544a]"
            >
              شروع کشف ایده‌ها
              <ArrowLeft size={15} />
            </Link>
          </div>
        )}
      </section>
      {/* پلن و هشدارها */}
      <div className="mt-8 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
              <Crown size={18} className="text-[#ff6154]" /> پلن {planDef.fa}
            </p>
            <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400">
              {plan === 'free'
                ? 'رایگان برای همیشه — بدون انقضا'
                : expires
                  ? `اعتبار تا ${faFull(expires)}`
                  : 'بدون انقضا ♾️ (دسترسی کامل بنیان‌گذار)'}
            </p>
          </div>
          <div className="flex gap-2">
            {plan !== 'team' && (
              <Link href="/pricing" className="rounded-xl bg-[#ff6154] px-4 py-2 text-xs font-black text-white hover:bg-[#e5544a]">ارتقا پلن ⬆</Link>
            )}
            {(plan === 'investor' || plan === 'team') && (
              <Link href="/insights" className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black text-white">📊 هوش رقابتی</Link>
            )}
            {plan === 'team' && (
              <Link href="/team" className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-black text-white">👥 فضای تیمی</Link>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:bg-gray-800">
          <p className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
            <Bell size={15} className="text-[#ff6154]" /> هشدار روزانه ایده‌های حوزه من (۱۷:۰۰)
          </p>
          {plan === 'free' ? (
            <Link href="/pricing" className="text-xs font-black text-[#ff6154]">مخصوص Pro ⬆</Link>
          ) : (
            <button onClick={toggleAlerts} className={`rounded-full px-3 py-1 text-xs font-black ${alerts ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'}`}>
              {alerts ? 'فعال ✅' : 'غیرفعال'}
            </button>
          )}
        </div>
      </div>

      {/* پروفایل */}
      <section className="mt-8 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-100 pb-5 dark:border-gray-800">
          <p className="text-xs font-black text-gray-400">
            تنظیمات حساب
          </p>

          <h2 className="mt-1 text-xl font-black text-gray-950 dark:text-white">
            اطلاعات حرفه‌ای من
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-500 dark:text-gray-400">
            این اطلاعات کمک می‌کند تجربه ایده‌جو برای حوزه کاری و موقعیت حرفه‌ای شما مرتبط‌تر شود.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          {form.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.avatar} alt="پروفایل" className="h-16 w-16 rounded-full object-cover ring-2 ring-[#ff6154]/30" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-xl font-black text-gray-400 dark:bg-gray-800">
              {(form.first_name || profile.email).slice(0, 1)}
            </span>
          )}
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            <Camera size={14} /> آپلود تصویر
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>نام</label>
            <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>نام خانوادگی</label>
            <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>استان</label>
            <select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value, city: '' })} className={inputCls}>
              <option value="">انتخاب استان…</option>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>شهر</label>
            <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls} disabled={!form.province}>
              <option value="">{form.province ? 'انتخاب شهر…' : 'اول استان را انتخاب کنید'}</option>
              {(CITIES[form.province] ?? []).map((ct) => <option key={ct} value={ct}>{ct}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>موبایل</label>
            <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="09xxxxxxxxx" dir="ltr" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>نام شرکت / استارتاپ</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>سمت</label>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="مثلاً بنیان‌گذار، مدیر محصول" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>تخصص</label>
            <input value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} placeholder="مثلاً فرانت‌اند، مارکتینگ" className={inputCls} />
          </div>
        </div>

        {msg && <p className="mt-3 text-xs font-bold text-[#ff6154]">{msg}</p>}
        <button onClick={save} disabled={busy} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#ff6154] px-5 text-sm font-black text-white transition hover:bg-[#e5544a] disabled:opacity-40 sm:w-auto">
          <Save size={15} /> ذخیره تغییرات
        </button>
      </section>
    </main>
  );
}