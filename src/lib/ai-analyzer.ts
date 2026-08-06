import Groq from 'groq-sdk';
import type { IranEquivalent, Product } from '@/types';

export async function analyzeIranEquivalent(
  product: Product,
): Promise<IranEquivalent | undefined> {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    console.warn('⚠️  GROQ_API_KEY not set — skipping AI analysis');
    return undefined;
  }

  const groq = new Groq({ apiKey: key });

  const prompt = `You are an expert startup advisor for the Iranian market.

Product from ProductHunt:
- Name: ${product.name}
- Tagline: ${product.tagline}
- Description: ${product.description}
- Category: ${product.category}

Suggest an Iranian equivalent startup idea. Consider Iranian market conditions, local payment systems (Shaparak), Persian language, culture, competition and legal aspects.

Respond ONLY with valid JSON in this exact shape:
{
  "productName": "نام پیشنهادی فارسی",
  "description": "توضیح کامل محصول پیشنهادی به فارسی",
  "marketOpportunity": "فرصت بازار در ایران به فارسی",
  "estimatedBudget": "تخمین بودجه راه‌اندازی به تومان",
  "targetAudience": "مخاطب هدف به فارسی",
  "challenges": ["چالش ۱", "چالش ۲", "چالش ۳"],
  "monetization": ["روش درآمدی ۱", "روش درآمدی ۲"],
  "techStack": ["تکنولوژی ۱", "تکنولوژی ۲"],
  "confidence": 85
}`;

  try {
    const res = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a startup advisor for the Iranian market. Respond only with valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = res.choices[0]?.message?.content ?? '{}';
    const match = content.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : '{}');

    return {
      productName: parsed.productName ?? 'نامشخص',
      description: parsed.description ?? '',
      marketOpportunity: parsed.marketOpportunity ?? '',
      estimatedBudget: parsed.estimatedBudget ?? '',
      targetAudience: parsed.targetAudience ?? '',
      challenges: Array.isArray(parsed.challenges) ? parsed.challenges : [],
      monetization: Array.isArray(parsed.monetization) ? parsed.monetization : [],
      techStack: Array.isArray(parsed.techStack) ? parsed.techStack : [],
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 50,
    };
  } catch (err) {
    console.error(`❌ AI analysis failed for ${product.name}:`, err);
    return undefined;
  }
}
