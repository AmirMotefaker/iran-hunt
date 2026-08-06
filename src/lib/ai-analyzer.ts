import type { IranEquivalent, PHComment, Product } from '@/types';

export interface AIAnalysis {
  faDescription: string;
  faComments: PHComment[];
  iranEquivalent: IranEquivalent;
}

const EMPTY: AIAnalysis = {
  faDescription: '',
  faComments: [],
  iranEquivalent: {
    productName: 'نامشخص',
    description: '',
    marketOpportunity: '',
    estimatedBudget: '',
    targetAudience: '',
    challenges: [],
    monetization: [],
    techStack: [],
    confidence: 0,
  },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGroq(apiKey: string, prompt: string, retries = 2): Promise<string> {
  const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

  for (const model of models) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: 'You are a startup advisor and professional English-to-Persian translator. Respond ONLY with valid JSON. No markdown, no explanation.',
              },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 2000,
            response_format: { type: 'json_object' },
          }),
        });

        if (response.status === 429) {
          const wait = Math.pow(2, attempt) * 3000;
          console.warn(`      ⏳ Rate limit (${model}), waiting ${wait / 1000}s...`);
          await sleep(wait);
          continue;
        }

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`      ⚠️ ${model} HTTP ${response.status}: ${errText.slice(0, 80)}`);
          break;
        }

        const json = (await response.json()) as any;
        const content = json.choices?.[0]?.message?.content ?? '{}';
        console.log(`      ✅ ${model}`);
        return content;
      } catch (err: any) {
        if (attempt < retries - 1) {
          await sleep(Math.pow(2, attempt) * 1000);
        } else {
          break;
        }
      }
    }
  }
  throw new Error('Groq failed');
}

export async function analyzeProduct(product: Product): Promise<AIAnalysis> {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    console.warn('⚠️  GROQ_API_KEY not set — skipping AI (will be filled by GitHub Actions)');
    return EMPTY;
  }

  const commentsText = (product.comments ?? [])
    .slice(0, 3)
    .map((c) => `[${c.user}]: ${c.text.slice(0, 150)}`)
    .join('\n');

  const prompt = `Analyze this ProductHunt product for the Iranian market:

NAME: ${product.name}
TAGLINE: ${product.tagline}
DESCRIPTION: ${product.description.slice(0, 500)}
CATEGORY: ${product.category}
COMMENTS:
${commentsText || '(none)'}

Tasks:
1. Translate description to fluent Persian.
2. Translate 3 best comments to fluent Persian, keeping usernames.
3. Suggest an Iranian equivalent startup (consider Shaparak, Persian/RTL, local culture).
4. Format estimatedBudget like "۵۰۰ میلیون تومان".

Return ONLY valid JSON:
{
  "faDescription": "توضیح روان فارسی",
  "faComments": [{"user": "username", "text": "ترجمه"}],
  "iranEquivalent": {
    "productName": "نام فارسی",
    "description": "توضیح مشابه ایرانی",
    "marketOpportunity": "فرصت بازار",
    "estimatedBudget": "۵۰۰ میلیون تومان",
    "targetAudience": "مخاطب",
    "challenges": ["چالش۱","چالش۲","چالش۳"],
    "monetization": ["روش۱","روش۲"],
    "techStack": ["تک۱","تک۲"],
    "confidence": 85
  }
}`;

  try {
    const content = await callGroq(key, prompt);
    const match = content.match(/\{[\s\S]*\}/);
    const p = JSON.parse(match ? match[0] : '{}');

    return {
      faDescription: p.faDescription ?? '',
      faComments: Array.isArray(p.faComments) ? p.faComments.slice(0, 3) : [],
      iranEquivalent: {
        productName: p.iranEquivalent?.productName ?? 'نامشخص',
        description: p.iranEquivalent?.description ?? '',
        marketOpportunity: p.iranEquivalent?.marketOpportunity ?? '',
        estimatedBudget: p.iranEquivalent?.estimatedBudget ?? '',
        targetAudience: p.iranEquivalent?.targetAudience ?? '',
        challenges: p.iranEquivalent?.challenges ?? [],
        monetization: p.iranEquivalent?.monetization ?? [],
        techStack: p.iranEquivalent?.techStack ?? [],
        confidence: p.iranEquivalent?.confidence ?? 50,
      },
    };
  } catch (err) {
    console.error(`❌ AI failed for ${product.name}:`, err);
    return EMPTY;
  }
}

