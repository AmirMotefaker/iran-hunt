'use client';

import { Globe, Lock, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { login, me, signup } from '@/lib/auth-client';
import type { Product } from '@/types';

export function GatedContent({ product }: { product: Product }) {
  const [unlocked, setUnlocked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { me().then((e) => setUnlocked(!!e?.email)); }, []);

  const submit = async () => {
    setBusy(true); setError('');
    let r = await signup(email, password);
    if (r.error && String(r.error).includes('قبلاً')) r = await login(email, password);
    if (r.ok) setUnlocked(true);
    else setError(r.error ?? 'خطا');
    setBusy(false);
  };

  if (unlocked) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900/40 dark:bg-green-950/20">
          <h4 className="flex items-center gap-2 font-extrabold text-green-900 dark:text-green-200">
            <Sparkles size={18} /> توضیحات کامل و تکمیلی
          </h4>
          <div className="mt-3 space-y-3 text-sm leading-8 text-green-900 dark:text-green-100">
            {product.description && (
              <p dir="ltr" className="rounded-xl border border-green-200/50 bg-white/50 p-3 dark:border-green-900/30 dark:bg-gray-900/50">{product.description}</p>
            )}
            {product.longDescription && product.longDescription !== product.description && (
              <p dir="ltr" className="rounded-xl border border-green-200/50 bg-white/50 p-3 dark:border-green-900/30 dark:bg-gray-900/50">{product.longDescription}</p>
            )}
            {product.faDescription && (
              <p className="rounded-xl border border-green-200/50 bg-white/50 p-3 dark:border-green-900/30 dark:bg-gray-900/50">🇮🇷 {product.faDescription}</p>
            )}
            {product.maker && (
              <p className="rounded-xl border border-green-200/50 bg-white/50 p-3 dark:border-green-900/30 dark:bg-gray-900/50">
                👤 <b>سازنده:</b> {product.maker} {product.makerTitle && `— ${product.makerTitle}`}
              </p>
            )}
          </div>
        </div>
        {product.websiteUrl && (
          <a href={product.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700">
            <Globe size={16} /> وب‌سایت رسمی محصول
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
      {!showForm ? (
        <>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            🔒 برای مشاهده <b>توضیحات کامل</b>، <b>وب‌سایت رسمی</b>، <b>اسکرین‌شات‌ها</b> و <b>تحلیل مشابه ایرانی</b> ثبت‌نام کن — کاملاً رایگان.
          </p>
          <button onClick={() => setShowForm(true)} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#ff6154] px-4 py-2 text-sm font-bold text-white shadow hover:bg-[#e5544a]">
            <Lock size={15} /> باز کردن قفل توضیحات کامل
          </button>
        </>
      ) : (
        <div className="space-y-3">
          <h4 className="font-extrabold text-gray-800 dark:text-white">ثبت‌نام برای باز کردن قفل 🔓</h4>
          <input type="email" dir="ltr" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
          <input type="password" dir="ltr" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
          {error && <p className="text-xs font-bold text-red-500">{error}</p>}
          <button onClick={submit} disabled={busy || !email || password.length < 6} className="w-full rounded-xl bg-[#ff6154] px-4 py-2 text-sm font-bold text-white disabled:opacity-40">
            {busy ? 'لطفاً صبر کنید…' : 'ثبت‌نام و باز کردن قفل'}
          </button>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">حداقل ۶ کاراکتر برای رمز عبور</p>
        </div>
      )}
    </div>
  );
}
