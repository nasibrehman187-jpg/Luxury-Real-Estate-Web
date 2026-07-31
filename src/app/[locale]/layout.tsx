import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIConcierge from '@/components/ai/AIConcierge';
import WhatsAppButton from '@/components/whatsapp/WhatsAppButton';
import CookieConsent from '@/components/consent/CookieConsent';
import LuxuryPreloader from '@/components/ui/LuxuryPreloader';
import CustomCursor from '@/components/ui/CustomCursor';
import '@/app/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Tajawal:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-neoma-black text-neoma-ivory antialiased selection:bg-neoma-gold selection:text-neoma-black font-sans">
        <NextIntlClientProvider messages={messages}>
          <LuxuryPreloader />
          <CustomCursor />
          <Navbar locale={locale} />
          <main className="min-h-screen">{children}</main>
          <Footer locale={locale} />
          <AIConcierge locale={locale} />
          <WhatsAppButton locale={locale} />
          <CookieConsent locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
