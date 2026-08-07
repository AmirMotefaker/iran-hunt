import { NextRequest, NextResponse } from 'next/server';
import { CYCLES } from '@/lib/plans';
import sql from '@/lib/db';

const ZP_API = 'https://api.zarinpal.com/pg/v4';

export async function GET(req: NextRequest) {
  const authority = req.nextUrl.searchParams.get('Authority') ?? '';
  const status = req.nextUrl.searchParams.get('Status') ?? '';
  const origin = req.nextUrl.origin;

  if (status !== 'OK' || !authority) {
    await sql`UPDATE orders SET status='canceled' WHERE authority=${authority}`;
    return NextResponse.redirect(`${origin}/pricing?canceled=1`);
  }

  const merchant = process.env.ZARINPAL_MERCHANT_ID ?? '';
  const rows = await sql`SELECT * FROM orders WHERE authority=${authority} AND status='pending'`;
  if (!rows.length) return NextResponse.redirect(`${origin}/pricing?error=duplicate`);
  const order = rows[0];

  const res = await fetch(`${ZP_API}/payment/verify.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: merchant },
    body: JSON.stringify({ merchant_id: merchant, authority, amount: Number(order.amount_toman) * 10 }),
  });
  const json = (await res.json()) as any;

  if (json?.data?.code !== 100 && json?.data?.code !== 101) {
    await sql`UPDATE orders SET status='failed' WHERE authority=${authority}`;
    return NextResponse.redirect(`${origin}/pricing?error=verify`);
  }

  // فعال‌سازی پلن (تمدید روی تاریخ انقضای فعلی)
  const months = CYCLES.find((c) => c.id === order.cycle)?.months ?? 1;
  const user = await sql`SELECT plan, plan_expires_at FROM users WHERE email=${order.email}`;
  let base = new Date();
  if (user.length) {
    const exp = user[0].plan_expires_at ? new Date(user[0].plan_expires_at) : null;
    if (user[0].plan !== 'free' && exp && exp.getTime() > base.getTime()) base = exp;
  }
  const expires = new Date(base);
  expires.setMonth(expires.getMonth() + months);

  await sql`UPDATE users SET plan=${order.plan}, plan_expires_at=${expires.toISOString()} WHERE email=${order.email}`;
  await sql`UPDATE orders SET status='paid' WHERE authority=${authority}`;

  return NextResponse.redirect(`${origin}/dashboard?upgraded=1`);
}
