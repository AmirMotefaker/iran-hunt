import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { CYCLES, PLANS, priceFor } from '@/lib/plans';
import sql from '@/lib/db';

const ZP_API = 'https://api.zarinpal.com/pg/v4';

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'ابتدا وارد شوید' }, { status: 401 });

  const { plan, cycle } = await req.json();
  const planDef = PLANS.find((p) => p.id === plan);
  const cycleDef = CYCLES.find((c) => c.id === cycle);
  if (!planDef || !cycleDef || planDef.monthly === 0)
    return NextResponse.json({ error: 'پلن معتبر نیست' }, { status: 400 });

  const { total } = priceFor(planDef.monthly, cycle);

  const merchant = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchant)
    return NextResponse.json({ error: 'درگاه پرداخت به‌زودی فعال می‌شود — فعلاً از صفحه «درباره ما» با بنیان‌گذار هماهنگ کنید.' }, { status: 503 });

  const order = await sql`
    INSERT INTO orders (email, plan, cycle, amount_toman) VALUES (${user.email}, ${plan}, ${cycle}, ${total})
    RETURNING id`;

  const callback = `${req.nextUrl.origin}/api/payment/verify`;
  const res = await fetch(`${ZP_API}/payment/request.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: merchant },
    body: JSON.stringify({
      merchant_id: merchant,
      amount: total * 10, // ریال
      callback_url: callback,
      description: `اشتراک ${planDef.fa} ایده‌جو (${cycleDef.fa})`,
      metadata: { email: user.email, order_id: order[0].id },
    }),
  });
  const json = (await res.json()) as any;

  if (json?.data?.code !== 100 || !json?.data?.authority)
    return NextResponse.json({ error: `خطای زرین‌پال: ${json?.errors?.code ?? 'unknown'}` }, { status: 502 });

  await sql`UPDATE orders SET authority=${json.data.authority} WHERE id=${order[0].id}`;

  const sandbox = process.env.ZARINPAL_SANDBOX === 'true';
  const gateway = sandbox ? 'https://sandbox.zarinpal.com/StartPay/' : 'https://www.zarinpal.com/pg/StartPay/';
  return NextResponse.json({ url: gateway + json.data.authority });
}
