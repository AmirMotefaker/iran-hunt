import { Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-bl from-[#ff6154] via-[#ff8a5c] to-amber-400 px-8 py-14 text-center text-white shadow-2xl shadow-orange-200">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative text-3xl font-black sm:text-4xl">هر روز، یک قدم جلوتر از بازار</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-sm leading-7 text-white/90 sm:text-base">
            عضو <Link href="/" className="font-black underline decoration-white/60 underline-offset-2">ایده‌یاب</Link> شو تا قفل توضیحات تکمیلی، وب‌سایت رسمی ایده‌ها و تحلیل‌های اختصاصی مشابه ایرانی برات باز بشه — کاملاً رایگان.
          </p>
          <Link href="/login" className="relative mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-black text-[#ff6154] shadow-xl transition hover:scale-105">
            <Sparkles size={17} /> شروع رایگان
          </Link>
        </div>
      </div>

      <div className="mt-16 border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo size={34} />
              <span className="text-lg font-black dark:text-white">ایده‌یاب</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400">
              پلتفرم هوشمند ایده‌های جذاب و ترند استارتاپی — هر روز برترین ایده‌های جهانی با تحلیل فارسی روان و پیشنهاد مشابه ایرانی برای اکوسیستم استارتاپی ایران.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-800 dark:text-gray-200">دسترسی سریع</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/" className="transition hover:text-[#ff6154]">ایده‌های ترند</Link></li>
              <li><Link href="/categories" className="transition hover:text-[#ff6154]">دسته‌بندی‌ها</Link></li>
              <li><Link href="/about" className="transition hover:text-[#ff6154]">درباره ما</Link></li>
              <li><Link href="/login" className="transition hover:text-[#ff6154]">ورود / ثبت‌نام</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-800 dark:text-gray-200">منابع</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="https://github.com/AmirMotefaker" target="_blank" rel="noreferrer" className="transition hover:text-[#ff6154]">GitHub پروژه</a></li>
              <li><a href="https://amirmotefaker.ir" target="_blank" rel="noreferrer" className="transition hover:text-[#ff6154]">وب‌سایت بنیان‌گذار</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 py-5 text-center text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          ساخته شده با <Heart size={11} className="inline fill-[#ff6154] text-[#ff6154]" /> برای
          اکوسیستم استارتاپی ایران — © ۱۴۰۵{' '}
          <Link href="/" className="font-black text-gray-800 hover:text-[#ff6154] dark:text-gray-200">ایده‌یاب</Link> —{' '}
          <a href="https://amirmotefaker.ir" target="_blank" rel="noreferrer" className="font-black text-gray-800 hover:text-[#ff6154] dark:text-gray-200">امیر متفکر</a>
        </div>
      </div>
    </footer>
  );
}
