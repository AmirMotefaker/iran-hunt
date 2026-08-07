export type PlanId = 'free' | 'pro' | 'investor' | 'team';
export type CycleId = 'monthly' | 'six' | 'year';

export const CYCLES: Array<{ id: CycleId; fa: string; months: number; discount: number }> = [
  { id: 'monthly', fa: 'ماهانه', months: 1, discount: 0 },
  { id: 'six', fa: '۶ ماهه', months: 6, discount: 0.1 },
  { id: 'year', fa: '۱ ساله', months: 12, discount: 0.2 },
];

export interface Plan {
  id: PlanId;
  fa: string;
  tagline: string;
  monthly: number; // تومان
  highlight?: boolean;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: 'free', fa: 'رایگان', tagline: 'برای شروع و کشف', monthly: 0,
    features: [
      '۵ بازه زمانی + ۱۰ ایده در هر بازه',
      'ترجمه فارسی تگلاین و خلاصه توضیحات',
      'لایک، کامنت، امتیاز ستاره‌ای و اشتراک‌گذاری',
      'همه دسته‌بندی‌ها و تگ‌ها با صفحه اختصاصی',
      'داشبورد شخصی + پروفایل و آواتار',
      'تا ۲۰ بوکمارک',
    ],
  },
  {
    id: 'pro', fa: 'حرفه‌ای', tagline: 'برای بنیان‌گذاران و سازندگان', monthly: 150000, highlight: true,
    features: [
      'همه امکانات پلن رایگان',
      '🔓 توضیحات کامل + وب‌سایت رسمی + اسکرین‌شات',
      '🔓 تحلیل کامل مشابه ایرانی (فرصت، بودجه، مخاطب، درآمد)',
      '🔔 هشدار روزانه هوشمند (ایمیل/تلگرام) با انتخاب حوزه',
      '📁 بوکمارک نامحدود + کالکشنن موضوعی',
      '📤 خروجی CSV/PDF از ایده‌ها',
      '🎓 ۲۰٪ تخفیف بوت‌کمپ‌های ایده‌جو',
    ],
  },
  {
    id: 'investor', fa: 'سرمایه‌گذار', tagline: 'برای VCها، آنجل‌ها و تحلیلگران', monthly: 450000,
    features: [
      'همه امکانات پلن حرفه‌ای',
      '⚡ سیگنال زودهنگام: ترند جهانی بدون نسخه ایرانی',
      '📊 داشبورد ترند پیشرفته (رشد دسته‌ها)',
      '👁️ واچ‌لیست پورتفوی رقبا',
      '📑 گزارش هفتگی PDF خودکار',
      '🕘 آرشیو تاریخی ۱۲ ماهه',
      '🎧 پشتیبانی اولویت‌دار',
    ],
  },
  {
    id: 'team', fa: 'تیم و سازمان', tagline: 'شتاب‌دهنده‌ها، VCها، نوآوری شرکتی', monthly: 1500000,
    features: [
      'همه امکانات پلن سرمایه‌گذار',
      '👥 ۵ صندلی تیمی + داشبورد مشترک',
      '🔌 دسترسی API کامل به داده‌های ترجمه‌شده',
      '📊 گزارش ماهانه اختصاصی (AI + بازبینی انسانی)',
      '🎤 بریفینگ ماهانه ۳۰ دقیقه‌ای ترند',
      '🏢 Onboarding اختصاصی + فاکتور رسمی',
    ],
  },
];

export const PLAN_ORDER: Record<PlanId, number> = { free: 0, pro: 1, investor: 2, team: 3 };

export function hasPlan(current: PlanId, required: PlanId): boolean {
  return PLAN_ORDER[current] >= PLAN_ORDER[required];
}

export function priceFor(monthly: number, cycle: CycleId) {
  const c = CYCLES.find((x) => x.id === cycle)!;
  const total = Math.round(monthly * c.months * (1 - c.discount));
  const perMonth = Math.round(total / c.months);
  return { total, perMonth, months: c.months, discount: c.discount };
}

export const toman = (n: number) => n.toLocaleString('fa-IR');
