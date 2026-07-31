import { setRequestLocale } from 'next-intl/server';

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === 'ar';

  return (
    <div className="pt-28 pb-20 bg-neoma-black text-neoma-ivory px-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-gold-gradient">
        {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
      </h1>
      <div className="space-y-6 text-neoma-gray-300 text-sm leading-relaxed glass-panel p-8 rounded-3xl border-neoma-gold/30">
        <p>
          Welcome to NEOMA Residences. By accessing our platform and luxury real estate portal, you agree to comply with and be bound by the following terms and conditions.
        </p>
        <h3 className="text-lg font-playfair font-bold text-neoma-ivory">1. Intellectual Property</h3>
        <p>
          All architectural renders, masterplans, branding elements, logo designs, and content presented on this site are the exclusive intellectual property of NEOMA Residences. Unauthorized duplication is strictly prohibited.
        </p>
        <h3 className="text-lg font-playfair font-bold text-neoma-ivory">2. Disclaimers</h3>
        <p>
          Property prices, square meterages, and projected ROI figures are subject to final contract verification and market availability.
        </p>
      </div>
    </div>
  );
}
