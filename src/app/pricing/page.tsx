'use client';

import {
  ArrowLeft,
  BadgePercent,
  Check,
  CheckCircle2,
  Crown,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { me } from '@/lib/auth-client';
import {
  CYCLES,
  PLANS,
  faDigits,
  priceFor,
  toman,
  type CycleId,
  type PlanId,
} from '@/lib/plans';

const PLAN_META: Record<
  PlanId,
  {
    eyebrow: string;
    outcome: string;
    icon: typeof Rocket;
  }
> = {
  free: {
    eyebrow: 'برای شروع',
    outcome: 'کشف ایده‌ها و شناخت فرصت‌ها بدون هزینه',
    icon: Sparkles,
  },
  pro: {
    eyebrow: 'برای ساختن',
    outcome: 'از کشف ایده تا تحلیل عمیق و تصمیم برای اجرا',
    icon: Rocket,
  },
  investor: {
    eyebrow: 'برای سرمایه‌گذاری',
    outcome: 'رصد زودهنگام ترندها و فرصت‌های قابل سرمایه‌گذاری',
    icon: TrendingUp,
  },
  team: {
    eyebrow: 'برای سازمان',
    outcome: 'هوش بازار و همکاری تیمی برای تصمیم‌های بزرگ‌تر',
    icon: Users,
  },
};

export default function PricingPage() {
  const [cycle, setCycle] = useState<CycleId>('monthly');
  const [myPlan, setMyPlan] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'error' | 'info'>('info');
  const [buyingPlan, setBuyingPlan] = useState<PlanId | null>(null);

  useEffect(() => {
    me().then((r) => setMyPlan(r?.plan ?? null));

    const params = new URLSearchParams(window.location.search);

    if (params.get('canceled')) {
      setMsg('پرداخت لغو شد و هیچ مبلغی برای اشتراک ثبت نشد.');
      setMsgType('info');
    }

    if (params.get('error')) {
      setMsg('تأیید پرداخت کامل نشد. دوباره تلاش کن یا کمی بعد مراجعه کن.');
      setMsgType('error');
    }
  }, []);

  const buy = async (planId: PlanId) => {
    setMsg('');

    if (!myPlan) {
      window.location.href = '/login?next=/pricing';
      return;
    }

    setBuyingPlan(planId);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, cycle }),
      });

      const json = await res.json();

      if (res.ok && json.url) {
        window.location.href = json.url;
        return;
      }

      setMsg(json.error ?? 'شروع پرداخت ممکن نشد. دوباره تلاش کن.');
      setMsgType('error');
    } catch {
      setMsg('ارتباط با درگاه برقرار نشد. لطفاً دوباره تلاش کن.');
      setMsgType('error');
    } finally {
      setBuyingPlan(null);
    }
  };

  const activeCycle = CYCLES.find((item) => item.id === cycle)!;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <section className="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white px-5 py-9 shadow-sm sm:px-8 sm:py-12 dark:border-gray-800 dark:bg-gray-900">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#ff6154]/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ff6154]/10 px-4 py-2 text-xs font-black text-[#ff6154]">
            <Crown size={14} />
            پلن‌های ایده‌جو
          </span>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-gray-950 sm:text-5xl dark:text-white">
            برای مرحله‌ای که الان در آن هستی
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-gray-600 sm:text-base dark:text-gray-300">
            رایگان شروع کن، وقتی به تحلیل عمیق‌تر نیاز داشتی ارتقا بده و فقط
            برای سطحی که واقعاً استفاده می‌کنی هزینه پرداخت کن.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-2 dark:bg-gray-800">
              <ShieldCheck size={13} className="text-emerald-500" />
              پرداخت امن
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-2 dark:bg-gray-800">
              <CheckCircle2 size={13} className="text-[#ff6154]" />
              شروع رایگان
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-2 dark:bg-gray-800">
              <BadgePercent size={13} className="text-indigo-500" />
              تا ۲۰٪ صرفه‌جویی
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-7 max-w-2xl">
        <p className="mb-3 text-center text-xs font-black text-gray-400">
          دوره پرداخت را انتخاب کن
        </p>

        <div className="grid grid-cols-3 gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1 sm:gap-1.5 sm:p-1.5 dark:border-gray-700 dark:bg-gray-900">
          {CYCLES.map((item) => {
            const active = cycle === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCycle(item.id)}
                className={`relative min-h-14 rounded-xl px-2 py-2 text-xs font-black transition sm:text-sm ${
                  active
                    ? 'bg-gray-950 text-white shadow-sm dark:bg-white dark:text-gray-950'
                    : 'text-gray-500 hover:bg-white dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                <span className="block">{item.fa}</span>

                {item.discount > 0 && (
                  <span
                    className={`mt-0.5 block text-[9px] sm:text-[10px] ${
                      active
                        ? 'text-[#ff9c94] dark:text-[#ff6154]'
                        : 'text-[#ff6154]'
                    }`}
                  >
                    {faDigits(Math.round(item.discount * 100))}٪ تخفیف
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeCycle.discount > 0 && (
          <p className="mt-3 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
            با انتخاب {activeCycle.fa}،{' '}
            {faDigits(Math.round(activeCycle.discount * 100))}٪ کمتر از پرداخت
            ماهانه هزینه می‌کنی.
          </p>
        )}
      </section>

      {msg && (
        <div
          className={`mx-auto mt-6 max-w-2xl rounded-2xl border px-4 py-3 text-center text-sm font-bold ${
            msgType === 'error'
              ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300'
              : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300'
          }`}
        >
          {msg}
        </div>
      )}

      <section className="mt-10 grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((plan) => {
          const meta = PLAN_META[plan.id];
          const Icon = meta.icon;
          const price = priceFor(plan.monthly, cycle);
          const isCurrent = myPlan === plan.id;
          const regularTotal = plan.monthly * activeCycle.months;
          const savedAmount = Math.max(0, regularTotal - price.total);
          const isBuying = buyingPlan === plan.id;

          return (
            <article
              key={plan.id}
              className={`relative flex min-w-0 flex-col overflow-hidden rounded-[28px] border p-5 transition sm:p-6 ${
                plan.highlight
                  ? 'border-[#ff6154] bg-white shadow-xl shadow-[#ff6154]/10 ring-1 ring-[#ff6154]/20 dark:bg-gray-900'
                  : 'border-gray-200 bg-white shadow-sm hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'
              }`}
            >
              {plan.highlight && (
                <div className="-mx-5 -mt-5 mb-5 bg-[#ff6154] px-5 py-2 text-center text-[11px] font-black text-white sm:-mx-6 sm:-mt-6 sm:px-6">
                  بهترین انتخاب برای بنیان‌گذاران
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black text-[#ff6154]">
                    {meta.eyebrow}
                  </p>

                  <h2 className="mt-1 text-xl font-black text-gray-950 dark:text-white">
                    {plan.fa}
                  </h2>
                </div>

                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    plan.highlight
                      ? 'bg-[#ff6154]/10 text-[#ff6154]'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  <Icon size={18} />
                </span>
              </div>

              <p className="mt-3 text-sm font-bold leading-7 text-gray-600 sm:min-h-14 dark:text-gray-300">
                {meta.outcome}
              </p>

              <div className="mt-5 border-y border-gray-100 py-5 dark:border-gray-800">
                {plan.monthly === 0 ? (
                  <>
                    <p className="text-3xl font-black text-gray-950 dark:text-white">
                      رایگان
                    </p>
                    <p className="mt-1 text-xs font-bold text-gray-400">
                      بدون کارت بانکی و بدون انقضا
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-end gap-1">
                      <strong className="text-3xl font-black tracking-tight text-gray-950 dark:text-white">
                        {toman(price.perMonth)}
                      </strong>
                      <span className="pb-1 text-xs font-bold text-gray-500">
                        تومان / ماه
                      </span>
                    </div>

                    {cycle !== 'monthly' && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                          پرداخت {toman(price.total)} تومان برای {activeCycle.fa}
                        </p>

                        {savedAmount > 0 && (
                          <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                            {toman(savedAmount)} تومان صرفه‌جویی
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              <p className="mt-5 text-xs font-black text-gray-400">
                امکانات اصلی
              </p>

              <ul className="mt-3 flex-1 space-y-2.5 break-words">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm leading-6 text-gray-700 dark:text-gray-300"
                  >
                    <Check
                      size={15}
                      className="mt-1 shrink-0 text-[#ff6154]"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => {
                  if (plan.id === 'free') {
                    window.location.href = myPlan ? '/dashboard' : '/login';
                    return;
                  }

                  void buy(plan.id);
                }}
                disabled={isCurrent || isBuying || buyingPlan !== null}
                className={`mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition disabled:cursor-not-allowed ${
                  isCurrent
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                    : plan.highlight
                      ? 'bg-[#ff6154] text-white shadow-lg shadow-[#ff6154]/20 hover:bg-[#e5544a] disabled:opacity-60'
                      : 'bg-gray-950 text-white hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200'
                }`}
              >
                {isCurrent ? (
                  <>
                    <CheckCircle2 size={16} />
                    پلن فعلی شما
                  </>
                ) : isBuying ? (
                  'در حال انتقال به پرداخت…'
                ) : plan.id === 'free' ? (
                  <>
                    شروع رایگان
                    <ArrowLeft size={15} />
                  </>
                ) : (
                  <>
                    انتخاب پلن {plan.fa}
                    <ArrowLeft size={15} />
                  </>
                )}
              </button>
            </article>
          );
        })}
      </section>

      <section className="mt-10">
        <div className="text-center">
          <p className="text-xs font-black text-[#ff6154]">
            انتخاب سریع‌تر
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl dark:text-white">
            کدام پلن برای من مناسب‌تر است؟
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500 dark:text-gray-400">
            به‌جای مقایسه ده‌ها قابلیت، از نوع استفاده‌ای که از ایده‌جو داری شروع کن.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan) => {
            const meta = PLAN_META[plan.id];
            const Icon = meta.icon;
            const price = priceFor(plan.monthly, cycle);

            return (
              <div
                key={`guide-${plan.id}`}
                className={`rounded-2xl border p-4 ${
                  plan.highlight
                    ? 'border-[#ff6154]/40 bg-[#ff6154]/5'
                    : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    <Icon size={16} />
                  </span>

                  <div>
                    <p className="text-[10px] font-black text-gray-400">
                      {meta.eyebrow}
                    </p>

                    <strong className="block text-sm font-black text-gray-950 dark:text-white">
                      {plan.fa}
                    </strong>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-6 text-gray-600 dark:text-gray-300">
                  {meta.outcome}
                </p>

                <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-800">
                  {plan.monthly === 0 ? (
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      رایگان
                    </span>
                  ) : (
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      از{' '}
                      <strong className="text-sm font-black text-gray-950 dark:text-white">
                        {toman(price.perMonth)}
                      </strong>{' '}
                      تومان در ماه
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10 overflow-hidden rounded-[28px] border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 p-5 sm:p-6 dark:border-gray-800">
          <p className="text-xs font-black text-[#ff6154]">
            قبل از پرداخت
          </p>

          <h2 className="mt-1 text-xl font-black text-gray-950 dark:text-white">
            دقیقاً چه اتفاقی می‌افتد؟
          </h2>
        </div>

        <div className="grid gap-0 sm:grid-cols-3">
          <div className="p-5 sm:p-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff6154]/10 text-sm font-black text-[#ff6154]">
              ۱
            </span>

            <strong className="mt-4 block text-sm font-black text-gray-950 dark:text-white">
              پلن و دوره را انتخاب می‌کنی
            </strong>

            <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
              قیمت نهایی بر اساس همان دوره انتخابی محاسبه و قبل از پرداخت نمایش داده می‌شود.
            </p>
          </div>

          <div className="border-y border-gray-100 p-5 sm:border-x sm:border-y-0 sm:p-6 dark:border-gray-800">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff6154]/10 text-sm font-black text-[#ff6154]">
              ۲
            </span>

            <strong className="mt-4 block text-sm font-black text-gray-950 dark:text-white">
              وارد درگاه زرین‌پال می‌شوی
            </strong>

            <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
              پرداخت در محیط رسمی درگاه انجام می‌شود و اطلاعات بانکی داخل ایده‌جو ذخیره نمی‌شود.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff6154]/10 text-sm font-black text-[#ff6154]">
              ۳
            </span>

            <strong className="mt-4 block text-sm font-black text-gray-950 dark:text-white">
              پلن روی همان حساب فعال می‌شود
            </strong>

            <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
              بعد از تأیید موفق پرداخت، حساب به‌صورت خودکار به پلن خریداری‌شده ارتقا پیدا می‌کند.
            </p>
          </div>
        </div>
      </section>
      <section className="mt-10 rounded-[28px] border border-gray-200 bg-gray-50 p-5 sm:p-7 dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-5 text-center sm:grid-cols-3">
          <div>
            <ShieldCheck
              size={20}
              className="mx-auto text-emerald-500"
            />
            <strong className="mt-2 block text-sm font-black text-gray-950 dark:text-white">
              پرداخت امن زرین‌پال
            </strong>
            <p className="mt-1 text-xs leading-6 text-gray-500">
              پرداخت اشتراک از طریق درگاه رسمی انجام می‌شود.
            </p>
          </div>

          <div>
            <BadgePercent
              size={20}
              className="mx-auto text-[#ff6154]"
            />
            <strong className="mt-2 block text-sm font-black text-gray-950 dark:text-white">
              قیمت شفاف
            </strong>
            <p className="mt-1 text-xs leading-6 text-gray-500">
              مبلغ نهایی قبل از انتقال به درگاه مشخص است.
            </p>
          </div>

          <div>
            <Crown
              size={20}
              className="mx-auto text-amber-500"
            />
            <strong className="mt-2 block text-sm font-black text-gray-950 dark:text-white">
              ارتقای مستقیم حساب
            </strong>
            <p className="mt-1 text-xs leading-6 text-gray-500">
              پس از پرداخت موفق، پلن روی همان حساب فعال می‌شود.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
