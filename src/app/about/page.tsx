import { Brain, Github, Globe2, Lock, Timer, Trophy } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  { icon: Trophy, title: 'رتبه‌بندی واقعی', desc: 'ایده‌ها بر اساس رأی واقعی جامعه جهانی مرتب می‌شوند، نه سلیقه شخصی.' },
  { icon: Brain, title: 'تحلیل هوش مصنوعی', desc: 'ترجمه فارسی روان، خلاصه نظرات جامعه و تحلیل کامل هر ایده با AI.' },
  { icon: Globe2, title: 'مشابه ایرانی', desc: 'برای هر ایده جهانی، فرصت بازار، بودجه، مخاطب و چالش‌های نسخه ایرانی را می‌سنجیم.' },
  { icon: Timer, title: 'به‌روزرسانی روزانه', desc: 'هر روز ساعت ۱۷ به وقت تهران، ۵ بازه زمانی تازه‌سازی می‌شوند.' },
  { icon: Lock, title: 'عضویت رایگان', desc: 'با یک ثبت‌نام ساده، قفل وب‌سایت رسمی و توضیحات تکمیلی همه ایده‌ها باز می‌شود.' },
];

export const metadata = {
  title: 'درباره ما',
  description: 'داستان ایده‌یاب و بنیان‌گذار آن امیر متفکر؛ پلتفرم هوشمند ایده‌های ترند استارتاپی برای اکوسیستم کارآفرینی ایران.',
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <span className="inline-flex rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-bold text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
        داستان ما
      </span>
      <h1 className="mt-5 text-3xl font-black leading-[1.4] text-gray-900 dark:text-white sm:text-5xl sm:leading-[1.35]">
        ایران نباید دیرتر
        <span className="text-[#ff6154]"> ترندها را ببیند</span>
      </h1>
      <p className="mt-6 text-base leading-9 text-gray-700 dark:text-gray-300">
        ایده‌یاب از یک پرسش ساده متولد شد: هر روز هزاران ایده استارتاپی در جهان متولد می‌شود؛ چرا کارآفرینان ایرانی باید این ترندها را دیر، پراکنده و بدون تحلیل بومی ببینند؟ ما هر روز برترین ایده‌های جهانی را در پنج بازه زمانی گلچین می‌کنیم، به فارسی روان برمی‌گردانیم و برای هر کدام، نسخه ایرانی ممکن را با در نظر گرفتن بازار محلی، پرداخت شاپرک، فرهنگ و رقابت داخلی تحلیل می‌کنیم.
      </p>
      <p className="mt-4 text-base leading-9 text-gray-700 dark:text-gray-300">
        هدف ما ساده است: تبدیل شدن به قطب‌نمای اکوسیستم استارتاپی ایران — جایی که هر بنیان‌گذار، سرمایه‌گذار و سازنده‌ای، صبح‌ها با یک فنجان قهوه، نبض نوآوری جهان را به زبان خودشان دنبال کند.
      </p>

      <h2 className="mt-14 text-xl font-black text-gray-900 dark:text-white">چرا ایده‌یاب؟</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
            <f.icon size={20} className="text-[#ff6154]" />
            <h3 className="mt-3 font-extrabold text-gray-800 dark:text-gray-100">{f.title}</h3>
            <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">{f.desc}</p>
          </div>
        ))}

        <div className="rounded-3xl bg-gray-900 p-6 text-white shadow-lg dark:bg-gray-800 dark:ring-1 dark:ring-gray-700">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff6154] text-lg font-black">ا</div>
          <h3 className="mt-4 text-lg font-black">امیر متفکر</h3>
          <p className="mt-1 text-xs font-bold text-gray-400">بنیان‌گذار ایده‌یاب</p>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            «باور دارم ایده‌ها ارزان‌ترین و در عین حال ارزشمندترین دارایی جهان‌اند؛ هنر، دیدنِ آن‌ها در زمان درست است.»
          </p>
          <a href="https://github.com/AmirMotefaker" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold transition hover:bg-white/20">
            <Github size={14} /> دنبال‌کردن در GitHub
          </a>
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <p className="font-extrabold text-gray-800 dark:text-gray-100">آماده‌ای ایده بعدی‌ات را زودتر از بقیه ببینی؟</p>
        <Link href="/login" className="mt-4 inline-flex rounded-2xl bg-[#ff6154] px-6 py-3 text-sm font-black text-white shadow transition hover:bg-[#e5544a]">
          عضویت رایگان
        </Link>
      </div>
    </main>
  );
}
