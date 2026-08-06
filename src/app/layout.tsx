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
    default: 'IranHunt | ایده‌های ترند استارتاپی جهان به زبان فارسی',
    template: '%s | IranHunt',
  },
  description:
    'IranHunt پلتفرم هوشمند ایده‌یابی استارتاپی؛ هر روز ۱۰ ایده ترند جهانی در ۴ بازه زمانی با رتبه‌بندی واقعی، ترجمه فارسی روان و تحلیل مشابه ایرانی با هوش مصنوعی. ایده استارتاپی، ایده کسب‌وکار و ترندهای هوش مصنوعی را اینجا کشف کنید.',
  keywords: [
    'ایده استارتاپی',
    'ایده کسب و کار',
    'ایده‌های ترند',
    'استارتاپ ایران',
    'ایده هوش مصنوعی',
    'محصولات ترند جهانی',
    'تحلیل استارتاپ',
    'ایده یاب',
    'IranHunt',
  ],
  authors: [{ name: 'امیر متفکر', url: 'https://github.com/AmirMotefaker' }],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: SITE,
    siteName: 'IranHunt',
    title: 'IranHunt | ایده‌های ترند استارتاپی جهان به زبان فارسی',
    description:
      'هر روز ۱۰ ایده برتر جهانی در ۴ بازه زمانی + تحلیل مشابه ایرانی با هوش مصنوعی',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'IranHunt' }],
  },
  twitter: {
    card: 'summary',
    title: 'IranHunt | ایده‌های ترند استارتاپی',
    description: 'ایده‌های ترند جهانی + تحلیل مشابه ایرانی با AI',
    images: ['/logo.png'],
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'IranHunt',
      url: SITE,
      logo: `${SITE}/logo.png`,
      founder: { '@type': 'Person', name: 'امیر متفکر' },
      sameAs: ['https://github.com/AmirMotefaker'],
    },
    {
      '@type': 'WebSite',
      name: 'IranHunt',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
