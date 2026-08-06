import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
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
    default: 'ایده‌یاب | ایده‌های ترند استارتاپی جهان به زبان فارسی',
    template: '%s | ایده‌یاب',
  },
  description:
    'ایده‌یاب پلتفرم هوشمند ایده‌یابی استارتاپی؛ هر روز ۱۰ ایده ترند جهانی در ۴ بازه زمانی با رتبه‌بندی واقعی، ترجمه فارسی روان و تحلیل مشابه ایرانی با هوش مصنوعی. ایده استارتاپی، ایده کسب‌وکار و ترندهای هوش مصنوعی را اینجا کشف کنید.',
  keywords: [
    'ایده استارتاپی', 'ایده کسب و کار', 'ایده‌های ترند', 'استارتاپ ایران',
    'ایده هوش مصنوعی', 'ایده یاب', 'ایده‌یاب', 'ترندهای استارتاپی',
  ],
  authors: [{ name: 'امیر متفکر', url: 'https://github.com/AmirMotefaker' }],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: SITE,
    siteName: 'ایده‌یاب',
    title: 'ایده‌یاب | ایده‌های ترند استارتاپی جهان به زبان فارسی',
    description: 'هر روز ۱۰ ایده برتر جهانی در ۴ بازه زمانی + تحلیل مشابه ایرانی با هوش مصنوعی',
  },
  twitter: {
    card: 'summary',
    title: 'ایده‌یاب | ایده‌های ترند استارتاپی',
    description: 'ایده‌های ترند جهانی + تحلیل مشابه ایرانی با AI',
  },
  icons: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'ایده‌یاب',
      url: SITE,
      logo: `${SITE}/favicon.svg`,
      founder: { '@type': 'Person', name: 'امیر متفکر' },
      sameAs: ['https://github.com/AmirMotefaker'],
    },
    {
      '@type': 'WebSite',
      name: 'ایده‌یاب',
      url: SITE,
      inLanguage: 'fa-IR',
      description: 'پلتفرم هوشمند ایده‌های ترند استارتاپی',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.className}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
