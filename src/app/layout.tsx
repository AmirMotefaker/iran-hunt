import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IranHunt - روزانه 5 محصول برتر ProductHunt',
  description: 'هر روز 5 محصول برتر ProductHunt با تحلیل مشابه ایرانی توسط هوش مصنوعی',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
