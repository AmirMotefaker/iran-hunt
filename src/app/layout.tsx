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

export const metadata: Metadata = {
  title: 'IranHunt — پلتفرم هوشمند ایده‌های ترند استارتاپی',
  description:
    'هر روز ۱۰ ایده برتر جهانی در ۴ بازه زمانی، با رتبه‌بندی واقعی، توضیح فارسی روان و تحلیل مشابه ایرانی با هوش مصنوعی',
  icons: [{ url: '/logo.png', type: 'image/png' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
