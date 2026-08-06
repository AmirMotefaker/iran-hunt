import { Github, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-24">
      {/* CTA گرادیان - همون بنر نارنجی، حالا پایین و زیباتر */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-bl from-[#ff6154] via-[#ff8a5c] to-amber-400 px-8 py-14 text-center text-white shadow-2xl shadow-orange-200">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative text-3xl font-black sm:text-4xl">هر روز، یک قدم جلوتر از بازار</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-sm leading-7 text-white/90 sm:text-base">
            عضو IranHunt شو تا قفل توضیحات تکمیلی، وب‌سایت رسمی ایده‌ها و تحلیل‌های
            اختصاصی مشابه ایرانی برات باز بشه — کاملاً رایگان.
          </p>
          <Link
            href="/login"
            className="relative mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-black text-[#ff6154] shadow-xl transition hover:scale-105"
          >
            <Sparkles size={17} /> شروع رایگان
          </Link>
        </div>
      </div>

      {/* فوتر اصلی */}
      <div className="mt-16 border-t border-gray-100 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="IranHunt" className="h-9 w-9 rounded-xl object-contain" />
              <span className="text-lg font-black">IranHunt</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-gray-500">
              پلتفرم هوشمند ایده‌های جذاب و ترند استارتاپی — هر روز برترین ایده‌های
              جهانی با تحلیل فارسی روان و پیشنهاد مشابه ایرانی برای اکوسیستم
              استارتاپی ایران.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-black text-gray-800">دسترسی سریع</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-500">
              <li><Link href="/" className="transition hover:text-[#ff6154]">ایده‌های ترند</Link></li>
              <li><Link href="/categories" className="transition hover:text-[#ff6154]">دسته‌بندی‌ها</Link></li>
              <li><Link href="/about" className="transition hover:text-[#ff6154]">درباره ما</Link></li>
              <li><Link href="/login" className="transition hover:text-[#ff6154]">ورود / ثبت‌نام</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-gray-800">بنیان‌گذار</h4>
            <p className="mt-4 text-sm font-bold text-gray-700">امیر متفکر</p>
            <a
              href="https://github.com/AmirMotefaker"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
            >
              <Github size={15} /> AmirMotefaker
            </a>
          </div>
        </div>

        <div className="border-t border-gray-100 py-5 text-center text-xs text-gray-400">
          ساخته شده با <Heart size={11} className="inline text-[#ff6154]" /> برای
          اکوسیستم استارتاپی ایران — © ۱۴۰۵ IranHunt
        </div>
      </div>
    </footer>
  );
}
