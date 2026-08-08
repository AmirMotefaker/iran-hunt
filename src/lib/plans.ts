export type PlanId = 'free' | 'pro' | 'investor' | 'team';
export type CycleId = 'monthly' | 'six' | 'year';

export const CYCLES: Array<{ id: CycleId; fa: string; months: number; discount: number }> = [
  { id: 'monthly', fa: 'ماهانه', months: 1, discount: 0 },
  { id: 'six', fa: '۶ ماهه', months: 6, discount: 0.1 },
  { id: 'year', fa: '۱ ساله', months: 12, discount: 0.2 },
];

export interface Plan { id: PlanId; fa: string; tagline: string; monthly: number; highlight?: boolean; features: string[]; }

export const PLANS: Plan[] = [
  {
    id: 'free', fa: 'رایگان', tagline: 'برای شروع و کشف', monthly: 0,
    features: [
      '۵ بازه زمانی از امروز تا یک سال',
      '۱۰ ایده برتر در هر بازه',
      'ترجمه فارسی تگلاین و خلاصه',
      'لایک، کامنت و امتیاز ستاره‌ای',
      'اشتراک‌گذاری در شبکه‌های اجتماعی',
      'همه دسته‌بندی‌ها و تگ‌ها',
      'صفحه اختصاصی برای هر ایده',
      'داشبورد شخصی و پروفایل',
      'تا ۲۰ بوکمارک',
      'حالت تاریک و روشن',
    ],
  },
  {
    id: 'pro', fa: 'حرفه‌ای', tagline: 'برای بنیان‌گذاران و سازندگان', monthly: 150000, highlight: true,
    features: [
      'همه امکانات پلن رایگان',
      'توضیحات کامل هر ایده',
      'وب‌سایت رسمی محصول',
      'اسکرین‌شات واقعی محصول',
      'تحلیل کامل مشابه ایرانی',
      'هشدار روزانه هوشمند',
      'بوکمارک نامحدود',
      'کالکشنن موضوعی',
      'خروجی CSV و PDF',
      'تجربه بدون تبلیغات',
      '۲۰٪ تخفیف بوت‌کمپ‌ها',
    ],
  },
  {
    id: 'investor', fa: 'سرمایه‌گذار', tagline: 'برای VCها، آنجل‌ها و تحلیلگران', monthly: 450000,
    features: [
      'همه امکانات پلن حرفه‌ای',
      'سیگنال زودهنگام ایده‌ها',
      'داشبورد ترند پیشرفته',
      'نمودار رشد دسته‌ها',
      'واچ‌لیست پورتفوی رقبا',
      'گزارش هفتگی PDF',
      'آرشیو تاریخی ۱۲ ماهه',
      'مقایسه بازه‌های زمانی',
      'پشتیبانی اولویت‌دار',
      'دسترسی زودهنگام به فیچرها',
      'نشست ماهانه پرسش و پاسخ',
    ],
  },
  {
    id: 'team', fa: 'تیم و سازمان', tagline: 'شتاب‌دهنده‌ها، VCها، نوآوری شرکتی', monthly: 1500000,
    features: [
      'همه امکانات پلن سرمایه‌گذار',
      '۵ صندلی تیمی',
      'داشبورد مشترک تیمی',
      'یادداشت داخلی تیم',
      'دسترسی کامل API',
      'گزارش ماهانه اختصاصی',
      'بریفینگ ماهانه ترند',
      'Onboarding اختصاصی',
      'فاکتور رسمی سازمانی',
      'مدیر اکانت اختصاصی',
      'توافق‌نامه سطح خدمات',
    ],
  },
];

export const PLAN_ORDER: Record<PlanId, number> = { free: 0, pro: 1, investor: 2, team: 3 };
export function hasPlan(current: PlanId, required: PlanId): boolean { return PLAN_ORDER[current] >= PLAN_ORDER[required]; }

export function priceFor(monthly: number, cycle: CycleId) {
  const c = CYCLES.find((x) => x.id === cycle)!;
  const total = Math.round(monthly * c.months * (1 - c.discount));
  const perMonth = Math.round(total / c.months);
  return { total, perMonth, months: c.months, discount: c.discount };
}

export const toman = (n: number) => n.toLocaleString('fa-IR');
export const faDigits = (n: number) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
