'use client';

import { Camera, Heart, MessageCircle, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PROVINCES } from '@/lib/provinces';

const fa = (iso: string) =>
  new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(iso));

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [form, setForm] = useState({ first_name: '', last_name: '', province: '', city: '', mobile: '', avatar: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/profile').then((r) => (r.ok ? r.json() : null)).then((j) => {
      if (!j) { window.location.href = '/login?next=/dashboard'; return; }
      setProfile(j.profile); setLikes(j.likes); setComments(j.comments);
      setForm({
        first_name: j.profile.first_name ?? '', last_name: j.profile.last_name ?? '',
        province: j.profile.province ?? '', city: j.profile.city ?? '',
        mobile: j.profile.mobile ?? '', avatar: j.profile.avatar ?? '',
      });
    });
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

  if (!profile) return <main className="mx-auto max-w-3xl px-4 py-20 text-center text-gray-400">در حال بارگذاری…</main>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-black">👤 داشبورد من</h1>
      <p className="mt-1 text-sm text-gray-500">عضو ایده‌یاب از: <b>{fa(profile.created_at)}</b></p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
          <Heart size={16} className="mx-auto text-[#ff6154]" />
          <p className="mt-2 text-lg font-black">{likes.toLocaleString('fa-IR')}</p>
          <p className="text-[11px] font-bold text-gray-400">لایک</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
          <MessageCircle size={16} className="mx-auto text-indigo-500" />
          <p className="mt-2 text-lg font-black">{comments.toLocaleString('fa-IR')}</p>
          <p className="text-[11px] font-bold text-gray-400">نظر</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
          <p className="text-lg font-black text-emerald-600">فعال</p>
          <p className="text-[11px] font-bold text-gray-400">وضعیت عضویت</p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="font-extrabold text-gray-800">ویرایش پروفایل</h2>

        <div className="mt-5 flex items-center gap-4">
          {form.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.avatar} alt="پروفایل" className="h-16 w-16 rounded-full object-cover ring-2 ring-[#ff6154]/30" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-xl font-black text-gray-400">
              {(form.first_name || profile.email).slice(0, 1)}
            </span>
          )}
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50">
            <Camera size={14} /> آپلود تصویر پروفایل
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="نام" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
          <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="نام خانوادگی" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
          <select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm">
            <option value="">استان…</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="شهر" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
          <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="09xxxxxxxxx" dir="ltr" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
          <input value={profile.email} disabled className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-400" dir="ltr" />
        </div>

        {msg && <p className="mt-3 text-xs font-bold text-[#ff6154]">{msg}</p>}
        <button onClick={save} disabled={busy} className="mt-4 flex items-center gap-1.5 rounded-xl bg-[#ff6154] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40">
          <Save size={15} /> ذخیره تغییرات
        </button>
      </div>
    </main>
  );
}
