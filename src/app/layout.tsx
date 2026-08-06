import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IranHunt — روزانه ۱۰ محصول برتر ProductHunt',
  description:
    'هر روز ۱۰ محصول برتر ProductHunt با رتبه‌بندی واقعی، توضیح فارسی و تحلیل مشابه ایرانی با هوش مصنوعی',
  icons: [{ url: '/logo.png', type: 'image/png' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.className}>{children}</body>
    </html>
  );
}
