import type { IranEquivalent, PHComment, Product } from '@/types';

export interface AIAnalysis {
  faDescription: string;
  faComments: PHComment[];
  iranEquivalent: IranEquivalent;
  aiReview: string;
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function cleanJson(text: string): string {
  return text.replace(/```json/gi, '').replace(/```/g, '').trim();
}

export async function analyzeProduct(p: Product): Promise<AIAnalysis> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY not set');

  const commentsEn = (p.comments ?? []).slice(0, 5).map((c) => `${c.user}: ${c.text}`).join('\n');

  const prompt = `تو یک تحلیل‌گر ارشد استارتاپ هستی. برای محصول زیر خروجی JSON فارسی بده.

نام: ${p.name}
تگلاین: ${p.tagline}
توضیحات: ${(p.description ?? '').slice(0, 800)}
نظرات کاربران ProductHunt:
${commentsEn || '—'}

خروجی دقیقاً یک JSON با این فیلدها (بدون توضیح اضافه):
{
  "faDescription": "ترجمه روان و دقیق توضیحات محصول به فارسی (۲-۳ جمله)",
  "faComments": [{"user": "نام کاربر", "text": "ترجمه روان و دقیق نظر به فارسی"}],
  "iranEquivalent": {
    "productName": "نام نزدیک‌ترین محصول/استارتاپ ایرانی مشابه (یا پیشنهاد ساخت)",
    "description": "توضیح نسخه ایرانی",
    "marketOpportunity": "فرصت بازار در ایران",
    "estimatedBudget": "بودجه تقریبی ساخت (تومان)",
    "targetAudience": "مخاطب هدف در ایران",
    "challenges": ["چالش ۱", "چالش ۲"],
    "monetization": ["روش درآمد ۱"],
    "techStack": ["تکنولوژی ۱"],
    "confidence": 75
  },
  "aiReview": "یک تحلیل جذاب، کامل، دقیق و فنی از این محصول به فارسی (۴-۶ جمله): معماری و تکنولوژی احتمالی، مدل درآمدی، نقاط قوت و ضعف فنی، و چرا ترند شده."
}`;

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    }),
  });
  if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
  const json = await res.json();
  const parsed = JSON.parse(cleanJson(json.choices?.[0]?.message?.content ?? '{}'));

  return {
    faDescription: parsed.faDescription ?? p.tagline,
    faComments: Array.isArray(parsed.faComments) ? parsed.faComments : [],
    iranEquivalent: parsed.iranEquivalent ?? { productName: '', description: '', marketOpportunity: '', estimatedBudget: '', targetAudience: '', challenges: [], monetization: [], techStack: [], confidence: 0 },
    aiReview: parsed.aiReview ?? '',
  };
}
