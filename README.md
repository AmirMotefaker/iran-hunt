<div align="center">

# 🇮 IranHunt

### هر روز، ۵ محصول برتر ProductHunt + تحلیل هوش مصنوعی برای ساخت مشابه ایرانی

[![CI](https://github.com/AmirMotefaker/iran-hunt/actions/workflows/ci.yml/badge.svg)](https://github.com/AmirMotefaker/iran-hunt/actions/workflows/ci.yml)
[![Release](https://github.com/AmirMotefaker/iran-hunt/actions/workflows/release.yml/badge.svg)](https://github.com/AmirMotefaker/iran-hunt/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black)](https://nextjs.org/)
[![Bun](https://img.shields.io/badge/Bun-1.3-black)](https://bun.sh/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.3-38bdf8)](https://tailwindcss.com/)

**ایده‌یابی برای کارآفرینان + تحلیل بازار برای سرمایه‌گذاران + الهام برای تیم‌های فنی**

</div>

---

## ✨ IranHunt چیست؟

IranHunt هر روز به صورت خودکار ۵ محصول برتر [ProductHunt](https://www.producthunt.com/) را استخراج می‌کند و با هوش مصنوعی (Groq + Llama 3.3 70B) تحلیل می‌کند:

- 🎯 **این محصول چه کار می‌کند؟** — توضیح کامل
- 📂 **در چه دسته‌بندی است؟** — Category و Topics
- 🇮🇷 **مشابه ایرانی آن چیست؟** — ایده بومی‌سازی شده
- 💰 **فرصت بازار در ایران** — برآورد بودجه و درآمدزایی
- ⚠️ **چالش‌ها** — موانع قانونی، فنی و فرهنگی

## 🛠️ تکنولوژی‌ها (نسخه‌های ۲۰۲۶)

| بخش | تکنولوژی |
|------|----------|
| Framework | Next.js 16.3 (App Router + Turbopack) |
| Runtime | Bun 1.3 |
| Language | TypeScript 5.9 |
| Styling | TailwindCSS 4.3 |
| Scraping | Cheerio + Fetch (بدون مرورگر!) |
| AI | Groq SDK (Llama 3.3 70B) |
| CI/CD | GitHub Actions |
| Release | Semantic Release (خودکار) |

## 🚀 شروع سریع

```bash
# Clone
git clone https://github.com/AmirMotefaker/iran-hunt.git
cd iran-hunt

# Install
bun install

# Environment (اختیاری برای AI)
cp .env.example .env.local

# Development
bun run dev

# Scrape دستی
bun run scrape
