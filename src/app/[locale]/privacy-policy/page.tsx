import { setRequestLocale } from 'next-intl/server';

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === 'ar';

  return (
    <div className="pt-28 pb-20 bg-neoma-black text-neoma-ivory px-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-gold-gradient">
        {isAr ? 'سياسة الخصوصية وحماية البيانات (PDPL)' : 'Privacy Policy & Data Protection (Saudi PDPL)'}
      </h1>
      <div className="space-y-6 text-neoma-gray-300 text-sm leading-relaxed glass-panel p-8 rounded-3xl border-neoma-gold/30">
        <p>
          NEOMA Residences ("We", "Our", "Company") is committed to protecting your privacy in full compliance with the Kingdom of Saudi Arabia Personal Data Protection Law (PDPL) and international data privacy standards (GDPR).
        </p>
        <h3 className="text-lg font-playfair font-bold text-neoma-ivory">1. Data Collection</h3>
        <p>
          We collect personal identification data (name, phone number, email address, property preferences) when you submit a private consultation request or interact with our advisory team.
        </p>
        <h3 className="text-lg font-playfair font-bold text-neoma-ivory">2. Usage & Discretion</h3>
        <p>
          Your information is utilized solely for facilitating bespoke real estate viewings, investment advisory, and property acquisitions. We enforce strict non-disclosure protocols and never sell or transfer client data to unauthorized third parties.
        </p>
        <h3 className="text-lg font-playfair font-bold text-neoma-ivory">3. Security Standards</h3>
        <p>
          All digital records are secured using enterprise-grade encryption, Row Level Security (RLS) policies, and isolated Supabase storage architectures.
        </p>
      </div>
    </div>
  );
}
