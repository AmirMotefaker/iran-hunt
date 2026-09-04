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
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

function sanitize(text: string): string {
  return text
    .replace(/\[REDACTED\]/gi, '')
    .replace(/\\n/g, '\n')
    .replace(/[\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u0400-\u04ff\uac00-\ud7af\u3131-\u3163]/g, '')
    .replace(/(^|[\s،.؛:!؟?])IR(?=[\s،.؛:!؟?]|$)/g, ' ')
    .replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function cleanJson(text: string): string {
  return normalizeDigits(text.replace(/```json/gi, '').replace(/```/g, '').trim());
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs = 45000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export function buildPrompt(p: Product): string {
  const originals = (p.comments ?? []).slice(0, 8);
  const commentsEn = originals.map((c, i) => `${i + 1}) ${c.text}`).join('\n');
  return `تو یک مترجم حرفه‌ای فارسی و تحلیل‌گر ارشد استارتاپ هستی.

محصول: ${p.name}
تگلاین: ${p.tagline}
توضیحات: ${(p.description ?? '').slice(0, 800)}

نظرات واقعی کاربران (فقط متن):
${commentsEn || '—'}

قوانین: خروجی فقط JSON معتبر؛ متن‌ها فارسی روان؛ کلمات چینی/روس/ویتنامی ممنوع؛ [REDACTED] ممنوع؛ faComments آرایه رشته‌ها به همان ترتیب و دقیقاً به همان تعداد نظرات ورودی؛ estimatedBudget متن فارسی مثل «۲ تا ۴ میلیارد تومان».

خروجی:
{
  "faDescription": "ترجمه کامل توضیحات (حداقل ۴ جمله)",
  "faComments": ["ترجمه نظر ۱", "..."],
  "iranEquivalent": {
    "productName": "...", "description": "(۳ جمله)", "marketOpportunity": "(۲ جمله)",
    "estimatedBudget": "۲ تا ۴ میلیارد تومان", "targetAudience": "...",
    "challenges": ["...", "..."], "monetization": ["...", "..."],
    "techStack": ["Next.js", "PostgreSQL"], "confidence": 75
  },
  "aiReview": "تحلیل جامع با ساختار:\\n🔹 مسئله و راه‌حل:\\n...\\n🔹 معماری و تکنولوژی:\\n...\\n🔹 مدل درآمدی:\\n...\\n🔹 نقاط قوت:\\n- ...\\n🔹 نقاط ضعف:\\n- ...\\n🔹 نکته طلایی برای ایران:\\n..."
}`;
}

async function callGemini(key: string, prompt: string): Promise<string> {
  const models = ['gemini-3.6-flash'];
  const errors: string[] = [];

  for (const model of models) {
    try {
      const res = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        },
      );

      const body = await res.text();

      if (res.ok) {
        const json = JSON.parse(body);
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

        if (text) {
          console.log(`   ✨ model: ${model}`);
          return text;
        }

        errors.push(`Gemini ${model}: empty response`);
        continue;
      }

      const error = `Gemini ${model}: HTTP ${res.status}${
        body ? ` | ${body.slice(0, 500)}` : ''
      }`;

      errors.push(error);
      console.warn(`   ⚠️  ${error}`);
    } catch (e) {
      const error = `Gemini ${model}: ${
        e instanceof Error ? e.message : String(e)
      }`;

      errors.push(error);
      console.warn(`   ⚠️  ${error}`);
    }
  }

  throw new Error(errors.join(' || ') || 'Gemini failed');
}

async function getGroqModels(key: string): Promise<string[]> {
  const res = await fetchWithTimeout('https://api.groq.com/openai/v1/models', {
    headers: { Authorization: `Bearer ${key}` },
  });

  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Groq models HTTP ${res.status}${body ? ` | ${body.slice(0, 500)}` : ''}`);
  }

  const json = JSON.parse(body);
  return (json.data ?? [])
    .map((m: any) => String(m.id ?? ''))
    .filter(Boolean);
}

async function callGroq(key: string, prompt: string): Promise<string> {
  const available = await getGroqModels(key);

  const preferred = [
    'qwen/qwen3.8-27b',
    'qwen/qwen3.6-27b',
    'openai/gpt-oss-20b',
    'openai/gpt-oss-120b',
  ];

  const model = preferred.find((m) => available.includes(m));
  if (!model) {
    throw new Error(`Groq: no supported preferred model available; discovered=${available.slice(0, 20).join(',')}`);
  }

  for (let i = 0; i < 2; i++) {
    const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 4096,
      }),
    });

    if (res.status === 429) {
      await sleep(8000);
      continue;
    }

    const body = await res.text();

    if (!res.ok) {
      throw new Error(`Groq ${model}: HTTP ${res.status}${body ? ` | ${body.slice(0, 500)}` : ''}`);
    }

    const json = JSON.parse(body);
    console.log(`   ✨ model: ${model}`);
    return json.choices?.[0]?.message?.content ?? '';
  }

  throw new Error(`Groq ${model}: HTTP 429`);
}

function tryParse(text: string): any {
  const clean = cleanJson(text);
  try { return JSON.parse(clean); } catch { /* ادامه */ }
  const s = clean.slice(clean.indexOf('{'), clean.lastIndexOf('}') + 1);
  try { return JSON.parse(s); } catch { /* ادامه */ }
  let t = s;
  for (let i = 0; i < 5; i++) {
    const cut = Math.max(t.lastIndexOf(','), t.lastIndexOf('\",'));
    if (cut <= 0) break;
    t = t.slice(0, cut);
    for (const cand of [t + '}', t + ']}', t + '\"}]', t + '}]}']) {
      try { return JSON.parse(cand); } catch { /* ادامه */ }
    }
  }
  throw new Error('JSON parse failed');
}

export async function analyzeProduct(p: Product): Promise<AIAnalysis> {
  const prompt = buildPrompt(p);
  let text = '';
  let provider = '';
  const errors: string[] = [];

  if (process.env.GEMINI_API_KEY) {
    try { text = await callGemini(process.env.GEMINI_API_KEY, prompt); provider = 'gemini'; }
    catch (e: any) { errors.push(`gemini: ${e.message}`); console.warn(`   ⚠️  gemini: ${e.message}`); }
  }
  if (!text && process.env.GROQ_API_KEY) {
    try { text = await callGroq(process.env.GROQ_API_KEY, prompt); provider = 'groq'; }
    catch (e: any) { errors.push(`groq: ${e.message}`); console.warn(`   ⚠️  groq: ${e.message}`); }
  }
  if (!text) throw new Error(`AI failed: ${errors.join(' | ') || 'no key'}`);
  console.log(`   🤖 provider: ${provider}`);

  const parsed = tryParse(text);

  const originals = (p.comments ?? []).slice(0, 8);
  let texts: string[] = [];
  if (Array.isArray(parsed.faComments)) {
    texts = parsed.faComments.map((x: any) => (typeof x === 'string' ? x : x?.text ?? ''));
  }
  const faComments: PHComment[] = originals
    .map((c, i) => {
      const name = c.user && !String(c.user).includes('REDACTED') ? c.user : `کاربر ProductHunt ${i + 1}`;
      return { user: name, text: sanitize(texts[i] || c.text) };
    })
    .filter((c) => c.text.length > 5);

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
