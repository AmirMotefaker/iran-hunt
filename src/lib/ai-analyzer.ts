import type { IranEquivalent, PHComment, Product } from '@/types';

export interface AIAnalysis {
  faDescription: string;
  faComments: PHComment[];
  iranEquivalent: IranEquivalent;
  aiReview: string;
}

function normalizeDigits(text: string): string {
  return text
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٤٥٦٨٩'.indexOf(d)));
}

// حذف [REDACTED] + کاراکترهای چینی/ژاپنی + فاصله‌های اضافه
function sanitize(text: string): string {
  return text
    .replace(/\[REDACTED\]/gi, '')
    .replace(/[\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,،۔؛;!؟?])/g, '$1')
    .trim();
}

function cleanJson(text: string): string {
  return normalizeDigits(text.replace(/```json/gi, '').replace(/```/g, '').trim());
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function buildPrompt(p: Product): string {
  const originals = (p.comments ?? []).slice(0, 6);
  const commentsEn = originals.map((c, i) => `${i + 1}) ${c.text}`).join('\n');
  return `تو یک مترجم حرفه‌ای فارسی و تحلیل‌گر ارشد استارتاپ هستی.

محصول: ${p.name}
تگلاین: ${p.tagline}
توضیحات: ${(p.description ?? '').slice(0, 800)}

نظرات واقعی کاربران (فقط متن، بدون نام):
${commentsEn || '—'}

قوانین سخت (حتماً رعایت کن):
- خروجی فقط یک JSON معتبر، بدون هیچ توضیح اضافه
- تمام متن‌ها فقط به فارسی روان و طبیعی؛ استفاده از کاراکترهای چینی/کره‌ای/ژاپنی اکیداً ممنوع
- کلمات انگلیسی فقط برای نام محصول، برند یا اصطلاح فنی (مثل API) مجاز است
- هرگز از [REDACTED] یا هر نوع سانسور استفاده نکن؛ نام برندها و محصولات را دست‌نخورده بنویس
- faComments باید آرایه‌ای از رشته‌ها باشد: ترجمه روان نظرات بالا، به همان ترتیب و همان تعداد

خروجی:
{
  "faDescription": "ترجمه روان توضیحات محصول (۲- جمله)",
  "faComments": ["ترجمه نظر ۱", "ترجمه نظر ۲"],
  "iranEquivalent": {
    "productName": "نام پیشنهادی محصول ایرانی",
    "description": "توضیح نسخه ایرانی",
    "marketOpportunity": "فرصت بازار در ایران",
    "estimatedBudget": "بودجه تقریبی (تومان)",
    "targetAudience": "مخاطب هدف",
    "challenges": ["چالش ۱", "چالش ۲"],
    "monetization": ["روش درآمد ۱"],
    "techStack": ["Next.js"],
    "confidence": 75
  },
  "aiReview": "تحلیل جذاب و فنی (۴-۶ جمله): معماری احتمالی، مدل درآمدی، نقاط قوت/ضعف فنی، دلیل ترند شدن"
}`;
}

async function callGemini(key: string, prompt: string): Promise<string> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const json = await res.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function callGroq(key: string, prompt: string): Promise<string> {
  for (let i = 0; i < 2; i++) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], temperature: 0.5 }),
    });
    if (res.status === 429) { await sleep(15000); continue; }
    if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? '';
  }
  throw new Error('Groq 429');
}

export async function analyzeProduct(p: Product): Promise<AIAnalysis> {
  const prompt = buildPrompt(p);
  let text = '';
  const errors: string[] = [];

  // Gemini اول (فارسی بهتر + بدون سانسور)، بعد Groq
  if (process.env.GEMINI_API_KEY) {
    try { text = await callGemini(process.env.GEMINI_API_KEY, prompt); }
    catch (e: any) { errors.push(`gemini: ${e.message}`); }
  }
  if (!text && process.env.GROQ_API_KEY) {
    try { text = await callGroq(process.env.GROQ_API_KEY, prompt); }
    catch (e: any) { errors.push(`groq: ${e.message}`); }
  }
  if (!text) throw new Error(`AI failed: ${errors.join(' | ') || 'no provider key'}`);

  const parsed = JSON.parse(cleanJson(text));

  // نام کاربران از دیتای واقعی PH — فقط متن‌ها از AI
  const originals = (p.comments ?? []).slice(0, 6);
  let texts: string[] = [];
  if (Array.isArray(parsed.faComments)) {
    texts = parsed.faComments.map((x: any) => (typeof x === 'string' ? x : x?.text ?? ''));
  }
  const faComments: PHComment[] = originals.map((c, i) => ({
    user: c.user,
    text: sanitize(texts[i] || c.text),
  })).filter((c) => c.text.length > 5);

  const eqRaw = parsed.iranEquivalent ?? {};
  const iranEquivalent: IranEquivalent = {
    productName: sanitize(eqRaw.productName ?? ''),
    description: sanitize(eqRaw.description ?? ''),
    marketOpportunity: sanitize(eqRaw.marketOpportunity ?? ''),
    estimatedBudget: sanitize(eqRaw.estimatedBudget ?? ''),
    targetAudience: sanitize(eqRaw.targetAudience ?? ''),
    challenges: (eqRaw.challenges ?? []).map(sanitize),
    monetization: (eqRaw.monetization ?? []).map(sanitize),
    techStack: (eqRaw.techStack ?? []).map(sanitize),
    confidence: Number(eqRaw.confidence ?? 0) || 0,
  };

  return {
    faDescription: sanitize(parsed.faDescription ?? p.tagline),
    faComments,
    iranEquivalent,
    aiReview: sanitize(parsed.aiReview ?? ''),
  };
}
