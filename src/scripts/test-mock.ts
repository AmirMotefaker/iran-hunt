import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const TARGET_SLUG = 'coldtea';
const DATA_DIR = path.join(process.cwd(), 'data');

async function main() {
  const files = (await (await import('node:fs/promises')).readdir(DATA_DIR))
    .filter((f) => f.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error('❌ No data file found');
    process.exit(1);
  }

  const file = path.join(DATA_DIR, files[0]);
  const data = JSON.parse(await readFile(file, 'utf8'));

  let target: any = null;
  for (const key of ['today', 'yesterday', 'week', 'month', 'year']) {
    const found = (data.periods[key] ?? []).find((p: any) => p.slug === TARGET_SLUG);
    if (found) { target = found; break; }
  }

  if (!target) {
    console.error(`❌ Product ${TARGET_SLUG} not found`);
    process.exit(1);
  }

  console.log(`\n🎯 Mocking: ${target.name} (${target.votes} votes)\n`);

  // داده‌های ساختگی فارسی
  target.faDescription = 'پلتفرم هوش مصنوعی برای خودکارسازی نرم‌افزارها و ایجاد تجربه‌های کاربری هوشمند. Coldtea با استفاده از مدل‌های زبانی بزرگ، امکان خودکارسازی کامل فرآیندهای کاری را فراهم می‌کند.';
  
  target.faComments = [
    { user: 'Sarah M.', text: 'این محصول واقعاً انقلابی در نحوه کار تیم ما ایجاد کرد. خودکارسازی فرآیندها زمان ما را ۶۰٪ کاهش داد.' },
    { user: 'Alex K.', text: 'رابط کاربری عالی و مستندات کامل. پشتیبانی هم بسیار سریع و حرفه‌ای است.' },
    { user: 'Mike T.', text: 'تنها نقطه ضعف قیمت بالاست، اما در مقایسه با ارزشی که ارائه می‌دهد منطقی است.' },
    { user: 'Emma L.', text: 'API بسیار تمیز و مستندات عالی. ادغام با سیستم موجود ما خیلی راحت بود.' },
    { user: 'David R.', text: 'بعد از ۳ ماه استفاده، می‌توانم بگویم بهترین تصمیم سال ما بود.' },
  ];

  target.iranEquivalent = {
    productName: 'خودکار ساز',
    description: 'پلتفرم ایرانی برای خودکارسازی فرآیندهای کسب‌وکار با هوش مصنوعی',
    marketOpportunity: 'بازار B2B ایران با ۵۰۰ هزار شرکت فعال، نیاز شدید به خودکارسازی دارد',
    estimatedBudget: '۸۰۰ میلیون تا ۱.۵ میلیارد تومان',
    targetAudience: 'شرکت‌های متوسط و بزرگ ایرانی با ۵۰+ کارمند',
    challenges: ['زیرساخت ابری محدود', 'مقاومت سازمانی در برابر تغییر', 'کمبود متخصص AI'],
    monetization: ['اشتراک ماهانه SaaS', 'نسخه Enterprise سفارشی', 'خدمات مشاوره'],
    techStack: ['Next.js', 'Python FastAPI', 'PostgreSQL', 'LangChain'],
    confidence: 78,
  };

  target.aiReview = 'Coldtea.ai یک پلتفرم پیشرفته خودکارسازی نرم‌افزار است که با استفاده از مدل‌های زبانی بزرگ (LLMs)، امکان ایجاد "نرم‌افزارهای خودران" را فراهم می‌کند. معماری فنی آن بر پایه میکروسرویس‌ها و event-driven architecture بنا شده و از تکنولوژی‌های مدرنی مانند Kubernetes، Redis و PostgreSQL استفاده می‌کند. مدل درآمدی آن ترکیبی از اشتراک SaaS (از $49 تا $499 ماهانه) و نسخه Enterprise سفارشی است. نقاط قوت فنی شامل API تمیز، مستندات کامل، و پشتیبانی از ۲۰+ زبان برنامه‌نویسی است. نقاط ضعف احتمالی: وابستگی به API های خارجی (OpenAI/Anthropic) که می‌تواند latency ایجاد کند، و هزینه بالای عملیاتی برای پردازش‌های سنگین. ترند شدن آن به دلیل نیاز فزاینده بازار به خودکارسازی و کاهش هزینه‌های عملیاتی است.';

  await writeFile(file, JSON.stringify(data, null, 2), 'utf8');
  console.log('✅ Mock data saved!');
  console.log('🎉 حالا سایت رو باز کن و /product/coldtea رو ببین.');
}

main().catch((e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
