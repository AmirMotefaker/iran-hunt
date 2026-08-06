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

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGroq(apiKey: string, prompt: string, retries = 3): Promise<string> {
  for (const model of GROQ_MODELS) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content:
                  'You are a startup advisor and professional English-to-Persian translator. Respond ONLY with valid JSON. No markdown.',
              },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 2000,
            response_format: { type: 'json_object' },
          }),
        });

        if (response.status === 429) {
          const waitTime = Math.pow(2, attempt) * 2000;
          console.warn(`      ⏳ Rate limit, waiting ${waitTime / 1000}s...`);
          await sleep(waitTime);
          continue;
        }

        if (response.status === 403) {
          console.warn(`      🚫 ${model} forbidden, trying next model...`);
          break;
        }

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errText.slice(0, 100)}`);
        }

        const json = (await response.json()) as any;
        const content = json.choices?.[0]?.message?.content ?? '{}';
        console.log(`      ✅ ${model}`);
        return content;
      } catch (err: any) {
        if (attempt < retries - 1) {
          const wait = Math.pow(2, attempt) * 1000;
          console.warn(`      ⚠️ Retry ${attempt + 1}/${retries} in ${wait / 1000}s...`);
          await sleep(wait);
        } else {
          throw err;
        }
      }
    }
  }
  throw new Error('All Groq models failed');
}

export async function analyzeProduct(product: Product): Promise<AIAnalysis> {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    console.warn('⚠️  GROQ_API_KEY not set — skipping AI');
    return EMPTY;
  }

  // Use real usernames from scraper, just translate comment text
  const commentsBlock = (product.comments ?? [])
    .slice(0, 5)
    .map((c) => `[${c.user}]: ${c.text.slice(0, 200)}`)
    .join('\n');

  const prompt = `Analyze this ProductHunt product for the Iranian market:

NAME: ${product.name}
TAGLINE: ${product.tagline}
DESCRIPTION: ${product.description.slice(0, 500)}
CATEGORY: ${product.category}
COMMENTS:
${commentsBlock || '(none)'}

Tasks:
1. Translate description to fluent Persian.
2. For each of the 3 most insightful comments, ONLY translate the text to fluent Persian. KEEP the original username exactly as provided.
3. Suggest an Iranian equivalent startup idea (consider Shaparak, Persian/RTL, local culture, competition).
4. Format estimatedBudget in Persian like "۵۰۰ میلیون تومان" (not raw numbers).

Return valid JSON exactly in this shape:
{
  "faDescription": "توضیح روان فارسی",
  "faComments": [{"user": "original username", "text": "ترجمه فارسی"}],
  "iranEquivalent": {
    "productName": "نام فارسی پیشنهادی",
    "description": "توضیح مشابه ایرانی",
    "marketOpportunity": "فرصت بازار",
    "estimatedBudget": "مثلا ۵۰۰ میلیون تومان",
    "targetAudience": "مخاطب هدف",
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
