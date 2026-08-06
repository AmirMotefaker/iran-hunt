import { Github, Heart } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer id="about" className="mt-20 border-t border-gray-100 bg-white">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="IranHunt" className="h-8 w-8 rounded-lg" />
            <span className="text-lg font-black">IranHunt</span>
          </div>
          <p className="mt-3 text-sm leading-7 text-gray-500">
            پلتفرم هوشمند ایده‌های جذاب و ترند استارتاپی — هر روز برترین ایده‌های
            جهانی را با تحلیل فارسی روان و پیشنهاد مشابه ایرانی برای اکوسیستم
            استارتاپی ایران ارائه می‌دهیم.
          </p>
        </div>

        <div>
          <h4 className="font-extrabold text-gray-800">دسترسی سریع</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-[#ff6154]">ایده‌های ترند</Link></li>
            <li><Link href="/login" className="hover:text-[#ff6154]">ورود / ثبت‌نام</Link></li>
            <li><Link href="/admin" className="hover:text-[#ff6154]">پنل بنیان‌گذار</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold text-gray-800">ارتباط</h4>
          <a
            href="https://github.com/AmirMotefaker"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            <Github size={16} /> AmirMotefaker
          </a>
          <p className="mt-3 text-xs text-gray-400">بنیان‌گذار: امیر معتکر</p>
        </div>
      </div>

      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        ساخته شده با <Heart size={12} className="inline text-[#ff6154]" /> برای
        اکوسیستم استارتاپی ایران — © ۱۴۰۵ IranHunt
      </div>
    </footer>
  );
}
