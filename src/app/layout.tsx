import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800', '900'],
  display: 'swap',
});

const SITE = 'https://idehjo.ir';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'ایده‌جو | ایده‌های ترند استارتاپی جهان به زبان فارسی ۲۰۲۶',
    template: '%s | ایده‌جو',
  },
  description:
    'ایده‌جو، پلتفرم هوشمند ایده‌جوی استارتاپی در سال ۱۴۰۵؛ هر روز ۱۰ ایده ترند جهانی در ۵ بازه زمانی با رتبه‌بندی واقعی، ترجمه فارسی روان و تحلیل مشابه ایرانی با هوش مصنوعی.',
  keywords: [
    'ایده استارتاپی', 'ایده کسب و کار', 'ایده‌های ترند', 'استارتاپ ایران',
    'ایده هوش مصنوعی', 'ایده یاب', 'ایده‌جو', 'ترندهای ۲۰۲۶', 'ایده AI',
  ],
  authors: [{ name: 'امیر متفکر', url: 'https://amirmotefaker.ir' }],
  openGraph: {
    type: 'website', locale: 'fa_IR', url: SITE, siteName: 'ایده‌جو',
    title: 'ایده‌جو | ایده‌های ترند استارتاپی جهان به زبان فارسی',
    description: 'هر روز ۱۰ ایده برتر جهانی در ۵ بازه زمانی + تحلیل مشابه ایرانی با AI',
    images: [{ url: '/favicon.svg', width: 512, height: 512, alt: 'ایده‌جو' }],
  },
  twitter: { card: 'summary', title: 'ایده‌جو | ایده‌های ترند استارتاپی ۲۰۲۶', description: 'ایده‌های ترند جهانی + تحلیل مشابه ایرانی با AI', images: ['/favicon.svg'] },
  icons: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization', name: 'ایده‌جو', url: SITE, logo: `${SITE}/favicon.svg`,
      founder: { '@type': 'Person', name: 'امیر متفکر', url: 'https://amirmotefaker.ir', sameAs: ['https://github.com/AmirMotefaker', 'https://amirmotefaker.ir'] },
      sameAs: ['https://github.com/AmirMotefaker', 'https://amirmotefaker.ir'],
    },
    { '@type': 'WebSite', name: 'ایده‌جو', url: SITE, inLanguage: 'fa-IR', description: 'پلتفرم هوشمند ایده‌های ترند استارتاپی — ۱۴۰۵' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={vazirmatn.className}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
