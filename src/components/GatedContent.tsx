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

  useEffect(() => {
    me().then((e) => setUnlocked(!!e));
  }, []);

  const submit = async () => {
    setBusy(true);
    setError('');
    let r = await signup(email, password);
    if (r.error && String(r.error).includes('قبلاً')) {
      r = await login(email, password);
    }
    if (r.ok) setUnlocked(true);
    else setError(r.error ?? 'خطا');
    setBusy(false);
  };

  if (unlocked) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <h4 className="flex items-center gap-2 font-extrabold text-green-900">
            <Sparkles size={18} /> توضیحات تکمیلی
          </h4>
          <p className="mt-2 text-sm leading-8 text-green-900" dir="ltr">{product.description}</p>
        </div>
        {product.websiteUrl && (
          <a href={product.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700">
            <Globe size={16} /> وب‌سایت رسمی محصول
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
      {!showForm ? (
        <>
          <p className="text-sm text-gray-600">
            💡 خلاصه: {product.faDescription?.slice(0, 120) ?? product.tagline}…
          </p>
          <button onClick={() => setShowForm(true)} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#ff6154] px-4 py-2 text-sm font-bold text-white shadow hover:bg-[#e5544a]">
            <Lock size={15} /> توضیحات تکمیلی + وب‌سایت رسمی (رایگان با ثبت‌نام)
          </button>
        </>
      ) : (
        <div className="space-y-3">
          <h4 className="font-extrabold text-gray-800">ثبت‌نام برای باز کردن قفل 🔓</h4>
          <input type="email" dir="ltr" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm" />
          <input type="password" dir="ltr" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm" />
          {error && <p className="text-xs font-bold text-red-500">{error}</p>}
          <button onClick={submit} disabled={busy || !email || password.length < 6} className="w-full rounded-xl bg-[#ff6154] px-4 py-2 text-sm font-bold text-white disabled:opacity-40">
            {busy ? 'لطفاً صبر کنید…' : 'ثبت‌نام و باز کردن قفل'}
          </button>
          <p className="text-[11px] text-gray-400">حداقل ۶ کاراکتر برای رمز عبور</p>
        </div>
      )}
    </div>
  );
}
