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
    .replace(/[٠-٩]/g, (d) => String('٠١٣٤٥٦٧٨٩'.indexOf(d)));
}

function cleanJson(text: string): string {
  return normalizeDigits(text.replace(/```json/gi, '').replace(/```/g, '').trim());
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function buildPrompt(p: Product): string {
  const commentsEn = (p.comments ?? []).slice(0, 6).map((c) => `${c.user}: ${c.text}`).join('\n');
  return `تو یک تحلیل‌گر ارشد استارتاپ و مترجم حرفه‌ای هستی. برای محصول زیر خروجی JSON فارسی بده.

نام: ${p.name}
تگلاین: ${p.tagline}
توضیحات: ${(p.description ?? '').slice(0, 800)}
نظرات واقعی کاربران در ProductHunt:
${commentsEn || '—'}

وظایف:
1) faDescription: ترجمه روان و دقیق توضیحات محصول به فارسی (۲-۳ جمله)
2) faComments: تک‌تک نظرات بالا را به فارسی روان و دقیق ترجمه کن (همون تعداد، بدون حذف)
3) iranEquivalent: برای بازار ایران یک محصول مشابه پیشنهاد بده (نام، توضیح، فرصت بازار، بودجه، مخاطب، چالش‌ها، درآمد، tech stack، ضریب اطمینان)
4) aiReview: تحلیل جذاب، کامل، دقیق و فنی (۴-۶ جمله): معماری احتمالی، مدل درآمدی، نقاط قوت/ضعف فنی، چرا ترند شده

خروجی دقیقاً یک JSON (بدون توضیح اضافه):
{
  "faDescription": "...",
  "faComments": [{"user": "نام کاربر", "text": "ترجمه فارسی نظر"}],
  "iranEquivalent": {
    "productName": "...", "description": "...", "marketOpportunity": "...",
    "estimatedBudget": "...", "targetAudience": "...",
    "challenges": ["..."], "monetization": ["..."], "techStack": ["..."], "confidence": 75
  },
  "aiReview": "..."
}`;
}

async function callGroq(key: string, prompt: string): Promise<string> {
  for (let i = 0; i < 2; i++) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], temperature: 0.6 }),
    });
    if (res.status === 429) { await sleep(15000); continue; }
    if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? '';
  }
  throw new Error('Groq 429');
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

export async function analyzeProduct(p: Product): Promise<AIAnalysis> {
  const prompt = buildPrompt(p);
  let text = '';
  const errors: string[] = [];

  if (process.env.GROQ_API_KEY) {
    try { text = await callGroq(process.env.GROQ_API_KEY, prompt); }
    catch (e: any) { errors.push(`groq: ${e.message}`); }
  }
  if (!text && process.env.GEMINI_API_KEY) {
    try { text = await callGemini(process.env.GEMINI_API_KEY, prompt); }
    catch (e: any) { errors.push(`gemini: ${e.message}`); }
  }
  if (!text) throw new Error(`AI failed: ${errors.join(' | ') || 'no provider key'}`);

  const parsed = JSON.parse(cleanJson(text));
  return {
    faDescription: parsed.faDescription ?? p.tagline,
    faComments: Array.isArray(parsed.faComments) ? parsed.faComments : [],
    iranEquivalent: parsed.iranEquivalent ?? { productName: '', description: '', marketOpportunity: '', estimatedBudget: '', targetAudience: '', challenges: [], monetization: [], techStack: [], confidence: 0 },
    aiReview: parsed.aiReview ?? '',
  };
}
