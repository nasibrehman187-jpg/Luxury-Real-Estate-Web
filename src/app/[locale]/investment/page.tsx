import { setRequestLocale } from 'next-intl/server';
import InvestmentIntelligence from '@/components/home/InvestmentIntelligence';
import PrivateConsultationForm from '@/components/home/PrivateConsultationForm';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const baseUrl = 'https://neoma-residences.com';

  return {
    title: isAr ? 'مركز الاستثمار العقاري والنمو الرأسمالي | نيوما رزيدنسز' : 'Investment Intelligence Center | NEOMA Residences',
    description: isAr
      ? 'احسب العوائد الاستثمارية والقروض العقارية واستكشف توقعات النمو الرأسمالي مدعومة برؤية السعودية ٢٠٣٠.'
      : 'Model projected returns, rental yields, and financing options backed by Saudi Vision 2030 market insights.',
    alternates: {
      canonical: `${baseUrl}/${locale}/investment`,
      languages: {
        'en': `${baseUrl}/en/investment`,
        'ar': `${baseUrl}/ar/investment`,
        'x-default': `${baseUrl}/en/investment`,
      },
    },
  };
}

export default async function InvestmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-24 pb-20 bg-neoma-black text-neoma-ivory min-h-screen">
      <InvestmentIntelligence locale={locale} />
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <PrivateConsultationForm locale={locale} />
      </div>
    </div>
  );
}
