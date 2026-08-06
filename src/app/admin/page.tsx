'use client';

import { useEffect, useState } from 'react';

interface Row { email: string; created_at: string; }

export default function AdminPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/registrations');
      if (!res.ok) { setError('دسترسی غیرمجاز — فقط با ایمیل بنیان‌گذار وارد شوید'); return; }
      const json = await res.json();
      setRows(json.rows ?? []);
    })();
  }, []);

  const fa = (iso: string) =>
    new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(iso));

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-black">👑 CRM بنیان‌گذار</h1>
      <p className="mt-1 text-sm text-gray-500">لیست کاربران ثبت‌نام‌شده به همراه تاریخ و ساعت دقیق</p>

      {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">{error}</p>}

      {rows && (
        <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-right text-xs font-black text-gray-500">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">ایمیل</th>
                <th className="p-4">تاریخ و ساعت ثبت‌نام</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={3} className="p-8 text-center text-gray-400">هنوز ثبت‌نامی نیست</td></tr>
              )}
              {rows.map((r, i) => (
                <tr key={r.email} className="border-t border-gray-50">
                  <td className="p-4 font-bold text-gray-400">{(i + 1).toLocaleString('fa-IR')}</td>
                  <td className="p-4 font-bold" dir="ltr">{r.email}</td>
                  <td className="p-4 text-gray-600">{fa(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
