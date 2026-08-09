import type { IranEquivalent, PHComment, Product } from '@/types';

export interface AIAnalysis {
  faDescription: string;
  faComments: PHComment[];
  iranEquivalent: IranEquivalent;
  aiReview: string;
}

function normalizeDigits(text: string): string {
  return text
    .replace(/[۰-۹]/g, (d) => String('۰۱۳۴۵۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

function sanitize(text: string): string {
  return text
    .replace(/\[REDACTED\]/gi, '')
    .replace(/[\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g, '')
    .replace(/(^|\s)IR(?=\s|$|[.,،؛:!؟?])/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
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
توضیحات کامل: ${(p.description ?? '').slice(0, 1200)}

نظرات واقعی کاربران (فقط متن):
${commentsEn || '—'}

قوانین سخت:
- خروجی فقط یک JSON معتبر
- تمام متن‌ها فارسی روان، حرفه‌ای و بدون غلط؛ جمله‌بندی دقیق
- کاراکتر/کلمه چینی، ویتنامی یا هر زبان دیگر ممنوع؛ کلمه نامفهوم ممنوع
- هیچ پیشوند/پسوند اضافی (مثل IR یا FA) به نام محصول نچسبان
- [REDACTED] و سانسور ممنوع
- faComments: آرایه رشته‌ها = ترجمه دقیق و روان نظرات بالا، به همان ترتیب و همان تعداد
- estimatedBudget فقط متن فارسی واقعی مثل: «۲ تا  میلیارد تومان»

خروجی:
{
  "faDescription": "ترجمه کامل و جامع تمام توضیحات محصول به فارسی؛ حداقل ۴ جمله؛ روان و دقیق",
  "faComments": ["ترجمه نظر ۱", "..."],
  "iranEquivalent": {
    "productName": "نام پیشنهادی برند ایرانی",
    "description": "توضیح کامل و حرفه‌ای نسخه ایرانی (۳-۴ جمله)",
    "marketOpportunity": "تحلیل عمیق فرصت بازار ایران (۳ جمله)",
    "estimatedBudget": "مثلاً: ۲ تا ۴ میلیارد تومان",
    "targetAudience": "مخاطب هدف دقیق",
    "challenges": ["چالش ۱", "چالش ۲", "چالش ۳"],
    "monetization": ["روش ۱", "روش ۲"],
    "techStack": ["Next.js", "PostgreSQL"],
    "confidence": 75
  },
  "aiReview": "تحلیل جامع و حرفه‌ای با این ساختار دقیق (هر بخش ۲-۴ جمله یا بولت):\\n🔹 مسئله و راه‌حل:\\n...\\n🔹 معماری و تکنولوژی احتمالی:\\n...\\n🔹 مدل درآمدی:\\n...\\n🔹 نقاط قوت:\\n- ...\\n🔹 نقاط ضعف و ریسک‌ها:\\n- ...\\n🔹 نکته طلایی برای بازار ایران:\\n..."
}`;
}

async function callGemini(key: string, prompt: string): Promise<string> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4 } }),
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
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], temperature: 0.4 }),
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
  let provider = '';
  const errors: string[] = [];

  if (process.env.GEMINI_API_KEY) {
    try { text = await callGemini(process.env.GEMINI_API_KEY, prompt); provider = 'gemini'; }
    catch (e: any) { errors.push(`gemini: ${e.message}`); }
  }
  if (!text && process.env.GROQ_API_KEY) {
    try { text = await callGroq(process.env.GROQ_API_KEY, prompt); provider = 'groq'; }
    catch (e: any) { errors.push(`groq: ${e.message}`); }
  }
  if (!text) throw new Error(`AI failed: ${errors.join(' | ') || 'no key'}`);
  console.log(`   🤖 provider: ${provider}`);

  const parsed = JSON.parse(cleanJson(text));

  // نام کاربران ۱۰۰٪ از دیتای واقعی ProductHunt
  const originals = (p.comments ?? []).slice(0, 6);
  let texts: string[] = [];
  if (Array.isArray(parsed.faComments)) {
    texts = parsed.faComments.map((x: any) => (typeof x === 'string' ? x : x?.text ?? ''));
  }
  const faComments: PHComment[] = originals
    .map((c, i) => ({ user: c.user, text: sanitize(texts[i] || c.text) }))
    .filter((c) => c.text.length > 5 && !String(c.user).includes('REDACTED'));

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
