import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import { getAllCategories } from '@/lib/categories';
import { translateCategory } from '@/lib/translate';
import './globals.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800', '900'],
  display: 'swap',
});

const SITE = 'https://iranhunt.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'ایده‌یاب | ایده‌های ترند استارتاپی جهان به زبان فارسی ۲۰۲۶',
    template: '%s | ایده‌یاب',
  },
  description:
    'ایده‌یاب، پلتفرم هوشمند ایده‌یابی استارتاپی در سال ۱۴۰۵؛ هر روز ۱۰ ایده ترند جهانی در ۵ بازه زمانی (امروز، دیروز، هفته، ماه، سال) با رتبه‌بندی واقعی، ترجمه فارسی روان و تحلیل مشابه ایرانی با هوش مصنوعی.',
  keywords: [
    'ایده استارتاپی', 'ایده کسب و کار', 'ایده‌های ترند', 'استارتاپ ایران',
    'ایده هوش مصنوعی', 'ایده یاب', 'ایده‌یاب', 'ترندهای ۲۰۲۶', 'ایده AI',
    'محصولات ترند جهانی', 'تحلیل استارتاپ', 'کارآفرینی ایران', 'ایده ۱۴۰۵',
  ],
  authors: [{ name: 'امیر متفکر', url: 'https://amirmotefaker.ir' }],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: SITE,
    siteName: 'ایده‌یاب',
    title: 'ایده‌یاب | ایده‌های ترند استارتاپی جهان به زبان فارسی',
    description: 'هر روز ۱۰ ایده برتر جهانی در ۵ بازه زمانی + تحلیل مشابه ایرانی با AI',
    images: [{ url: '/favicon.svg', width: 512, height: 512, alt: 'ایده‌یاب' }],
  },
  twitter: {
    card: 'summary',
    title: 'ایده‌یاب | ایده‌های ترند استارتاپی ۲۰۲۶',
    description: 'ایده‌های ترند جهانی + تحلیل مشابه ایرانی با AI',
    images: ['/favicon.svg'],
  },
  icons: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  category: 'Technology',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'ایده‌یاب',
      url: SITE,
      logo: `${SITE}/favicon.svg`,
      founder: {
        '@type': 'Person',
        name: 'امیر متفکر',
        url: 'https://amirmotefaker.ir',
        sameAs: ['https://github.com/AmirMotefaker', 'https://amirmotefaker.ir'],
      },
      sameAs: ['https://github.com/AmirMotefaker', 'https://amirmotefaker.ir'],
    },
    {
      '@type': 'WebSite',
      name: 'ایده‌یاب',
      url: SITE,
      inLanguage: 'fa-IR',
      description: 'پلتفرم هوشمند ایده‌های ترند استارتاپی — ۱۴۰۵',
    },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const rawCategories = await getAllCategories();
  const categories = rawCategories.map((c) => ({
    name: c.name,
    nameFa: translateCategory(c.name),
    count: c.count,
    slug: c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, ''),
  }));

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={vazirmatn.className}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ThemeProvider>
          <Header categories={categories} />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
