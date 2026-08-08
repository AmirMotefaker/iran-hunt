'use client';

import { Bell, Bookmark, Camera, Crown, Heart, MessageCircle, Save } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { me } from '@/lib/auth-client';
import { CITIES } from '@/lib/cities';
import { PROVINCES } from '@/lib/provinces';
import { PLANS, toman } from '@/lib/plans';

const fa = (iso: string) =>
  new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(iso));

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [plan, setPlan] = useState('free');
  const [expires, setExpires] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [alerts, setAlerts] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', province: '', city: '', mobile: '', avatar: '', company: '', role: '', expertise: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const u = await me();
      if (!u?.email) { window.location.href = '/login?next=/dashboard'; return; }
      setPlan(u.plan ?? 'free'); setExpires(u.planExpiresAt ?? null);
      const res = await fetch('/api/profile');
      if (!res.ok) return;
      const j = await res.json();
      setProfile(j.profile); setLikes(j.likes); setComments(j.comments);
      setAlerts(!!j.profile.alerts);
      setForm({
        first_name: j.profile.first_name ?? '', last_name: j.profile.last_name ?? '',
        province: j.profile.province ?? '', city: j.profile.city ?? '',
        mobile: j.profile.mobile ?? '', avatar: j.profile.avatar ?? '', company: j.profile.company ?? '', role: j.profile.role ?? '', expertise: j.profile.expertise ?? '',
      });
      const b = await fetch('/api/bookmarks').then((x) => x.json());
      setBookmarks(b.bookmarks ?? []);
    })();
  }, []);

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
    setBusy(false);
  };

  const toggleAlerts = async () => {
    const next = !alerts;
    setAlerts(next);
    await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, alerts: next }) });
  };

  if (!profile) return <main className="mx-auto max-w-3xl px-4 py-20 text-center text-gray-400">در حال بارگذاری…</main>;

  const planDef = PLANS.find((p) => p.id === plan)!;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white">👤 داشبورد من</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">عضو ایده‌جو از: <b>{fa(profile.created_at)}</b></p>

      {/* کارت پلن */}
      <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
              <Crown size={18} className="text-[#ff6154]" /> پلن {planDef.fa}
            </p>
            <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400">
              {plan === 'free' ? 'رایگان برای همیشه' : expires ? `اعتبار تا ${fa(expires)}` : ''}
            </p>
          </div>
          <div className="flex gap-2">
            {plan !== 'team' && (
              <Link href="/pricing" className="rounded-xl bg-[#ff6154] px-4 py-2 text-xs font-black text-white hover:bg-[#e5544a]"> ارتقا پلن</Link>
            )}
            {plan === 'investor' || plan === 'team' ? (
              <Link href="/insights" className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black text-white">📊 هوش رقابتی</Link>
            ) : null}
            {plan === 'team' && (
              <Link href="/team" className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-black text-white">👥 فضای تیمی</Link>
            )}
          </div>
        </div>

        {/* هشدار روزانه (Pro+) */}
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
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

      {/* آمار */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <Heart size={16} className="mx-auto text-[#ff6154]" />
          <p className="mt-2 text-lg font-black text-gray-900 dark:text-white">{likes.toLocaleString('fa-IR')}</p>
          <p className="text-[11px] font-bold text-gray-400">لایک</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <MessageCircle size={16} className="mx-auto text-indigo-500" />
          <p className="mt-2 text-lg font-black text-gray-900 dark:text-white">{comments.toLocaleString('fa-IR')}</p>
          <p className="text-[11px] font-bold text-gray-400">نظر</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <Bookmark size={16} className="mx-auto text-amber-500" />
          <p className="mt-2 text-lg font-black text-gray-900 dark:text-white">{bookmarks.length.toLocaleString('fa-IR')}</p>
          <p className="text-[11px] font-bold text-gray-400">بوکمارک {plan === 'free' ? 'از ۲۰' : 'نامحدود'}</p>
        </div>
      </div>

      {/* پروفایل */}
      <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="font-extrabold text-gray-800 dark:text-gray-100">ویرایش پروفایل</h2>
        <div className="mt-5 flex items-center gap-4">
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

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="نام" className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
          <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="نام خانوادگی" className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
          <select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
            <option value="">استان…</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"><option value="">شهر…</option>{(CITIES[form.province] ?? []).map((ct) => <option key={ct} value={ct}>{ct}</option>)}</select>
          <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="09xxxxxxxxx" dir="ltr" className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="نام شرکت / استارتاپ" className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
          <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="سمت (مثلاً بنیان‌گذار، مدیر محصول)" className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
          <input value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} placeholder="تخصص (مثلاً فرانت‌اند، مارکتینگ)" className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
          <input value={profile.email} disabled className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-800" dir="ltr" />
        </div>

        {msg && <p className="mt-3 text-xs font-bold text-[#ff6154]">{msg}</p>}
        <button onClick={save} disabled={busy} className="mt-4 flex items-center gap-1.5 rounded-xl bg-[#ff6154] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40">
          <Save size={15} /> ذخیره تغییرات
        </button>
      </div>
    </main>
  );
}
