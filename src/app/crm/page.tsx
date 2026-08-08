'use client';

import { useEffect, useState } from 'react';
import { faDigits } from '@/lib/plans';

interface Row { email: string; created_at: string; first_name: string; last_name: string; province: string; city: string; mobile: string; company: string; role: string; expertise: string; }

// فرمت تاریخ شمسی حرفه‌ای: «پنجشنبه، ۱۵ مرداد ۱۴۰۵، ساعت ۱۴:۵۸»
const toPersianDigits = (s: string) => s.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);

function formatShamsiFull(iso: string): string {
  const d = new Date(iso);
  const dayName = new Intl.DateTimeFormat('fa-IR-u-nu-latn', { weekday: 'long' }).format(d);
  const date = new Intl.DateTimeFormat('fa-IR-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  const time = new Intl.DateTimeFormat('fa-IR-u-nu-latn', { hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
  return toPersianDigits(`${dayName}، ${date}، ساعت ${time}`);
}

export default function CrmPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/registrations');
      if (!res.ok) { setError('دسترسی غیرمجاز — فقط بنیان‌گذار'); return; }
      const json = await res.json();
      setRows(json.rows ?? []);
    })();
  }, []);

  const filtered = (rows ?? []).filter((r) =>
    [r.email, r.first_name, r.last_name, r.mobile, r.province, r.city].some((v) => (v ?? '').toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="rounded-full bg-[#ff6154] px-3 py-1 text-[10px] font-black text-white">PRIVATE</span>
          <h1 className="mt-3 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">👑 CRM بنیان‌گذار</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {rows ? `${rows.length.toLocaleString('fa-IR')} کاربر ثبت‌نام‌شده` : 'در حال بارگذاری…'}
          </p>
        </div>
        {rows && rows.length > 0 && (
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجو در ایمیل، نام، موبایل…"
            className="w-full max-w-xs rounded-xl border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white"
          />
        )}
      </div>

      {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-400">{error}</p>}

      {filtered.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-right text-xs font-black text-gray-500 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">نام</th>
                <th className="p-4">ایمیل</th>
                <th className="p-4">شرکت / سمت</th>
                <th className="p-4">موبایل</th>
                <th className="p-4">استان / شهر</th>
                <th className="p-4">تاریخ عضویت</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.email} className="border-t border-gray-50 hover:bg-orange-50/50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                  <td className="p-4 font-bold text-gray-400">{(i + 1).toLocaleString('fa-IR')}</td>
                  <td className="p-4 font-bold text-gray-800 dark:text-white">{r.first_name || r.last_name ? `${r.first_name} ${r.last_name}`.trim() : '—'}</td>
                  <td className="p-4 font-bold" dir="ltr">{r.email}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{r.company || '—'}{r.role ? `  · ${r.role} ` : ''}</td>
                  <td className="p-4">{r.mobile ? faDigits(r.mobile) : '—'}</td>
                  <td className="p-4">{r.province || '—'}{r.city ? `، ${r.city}` : ''}</td>
                  <td className="p-4 text-xs text-gray-600 dark:text-gray-300">{formatShamsiFull(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows && filtered.length === 0 && (
        <div className="mt-6 rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center text-gray-400 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-lg font-bold">🔍 نتیجه‌ای پیدا نشد</p>
        </div>
      )}
    </main>
  );
}
