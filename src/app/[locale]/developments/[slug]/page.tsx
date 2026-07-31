import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { formatCurrency } from '@/i18n/formatters';
import PrivateConsultationForm from '@/components/home/PrivateConsultationForm';
import { MapPin, Download, ShieldCheck, ArrowLeft, Navigation, HelpCircle, CheckCircle } from 'lucide-react';

const MOCK_DEVELOPMENTS_DB: Record<string, any> = {
  'the-obsidian-tower-riyadh': {
    id: 'a1b2c3d4-0001-4000-8000-000000000001',
    slug: 'the-obsidian-tower-riyadh',
    name_en: 'The Obsidian Tower',
    name_ar: 'برج الأوبسيديان الرياض',
    location: 'KAFD, Riyadh',
    starting_price: 12500000,
    category: 'Ultra-Luxury Tower',
    short_description_en: 'Rising 85 stories above King Abdullah Financial District, offering bespoke skyline residences with private helipads.',
    short_description_ar: 'يرتفع ٨٥ طابقاً فوق مركز الملك عبد الله المالي، ويقدم وحدات سكنية فاخرة مطلة على الأفق مع مهابط طائرات خاصة.',
    full_description_en: 'The Obsidian Tower redefines Saudi high-rise architecture. Featuring double-height living spaces, floor-to-ceiling smart glass, private infinity dip pools on every terrace, and dedicated butler services, it is the pinnacle of modern Arabian luxury.',
    full_description_ar: 'يعيد برج الأوبسيديان تعريف الهندسة المعمارية للأبراج في المملكة. يتميز بمساحات معيشة بارتفاع مضاعف، وزجاج ذكي من الأرضية حتى السقف، وأحواض سباحة خاصة في كل شرفة، بالإضافة إلى خدمات خادم شخصي مخصصة.',
    hero_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    gallery_images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Private Helipad', 'Infinity Pool', 'Bespoke Butler', 'Private Spa & Sauna', 'Automated Parking', 'Sommelier Lounge'],
    landmarks: [
      { name_en: 'King Khalid International Airport (RUH)', name_ar: 'مطار الملك خالد الدولي', category: 'Airport', distance_km: 24.5, travel_time: '18 mins' },
      { name_en: 'KAFD Metro Hub Station', name_ar: 'محطة مترو مركز الملك عبد الله المالي', category: 'Metro', distance_km: 0.4, travel_time: '2 mins walk' },
    ],
    faqs: [
      { q_en: 'What is the completion timeline for The Obsidian Tower?', q_ar: 'ما هو الجدول الزمني لإنجاز برج الأوبسيديان؟', a_en: 'Handover is scheduled for Q4 2027.', a_ar: 'من المقرر تسليم المشروع في الربع الرابع من عام ٢٠٢٧.' },
      { q_en: 'Are foreign nationals eligible to purchase residences?', q_ar: 'هل يحق للجنسيات غير السعودية تملك الوحدات؟', a_en: 'Yes, in accordance with Saudi Arabia Premium Residency laws.', a_ar: 'نعم، وفقاً لنظام الإقامة المميزة وتملك العقار في المملكة.' },
    ],
  },
  'diriyah-royal-estates': {
    id: 'a1b2c3d4-0002-4000-8000-000000000002',
    slug: 'diriyah-royal-estates',
    name_en: 'Diriyah Royal Estates',
    name_ar: 'قصور الدرعية الملكية',
    location: 'Historic Diriyah, Riyadh',
    starting_price: 28000000,
    category: 'Heritage Villa Estate',
    short_description_en: 'Exclusive Najdi-inspired royal estates surrounded by ancient date palms and UNESCO World Heritage landmarks.',
    short_description_ar: 'قصور ملكية مستوحاة من الطراز النجدي تحيط بها نخيل التمر الأثرية ومعالم اليونسكو للتراث العالمي.',
    full_description_en: 'Combining 300 years of Najdi heritage with modern sustainable engineering, Diriyah Royal Estates offers gated privacy, private equestrian facilities, subterranean motor galleries, and hand-carved stone craftsmanship.',
    full_description_ar: 'تجمع قصور الدرعية الملكية بين ٣٠٠ عام من التراث النجدي والهندسة المستدامة الحديثة، وتوفر خصوصية مطلقة، ومرافق فروسية خاصة، ومقرات عرض سيارات تحت الأرض، ومصنوعات حجرية منحوتة يدوياً.',
    hero_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    gallery_images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Private Stables', 'Najdi Courtyard', 'Subterranean Garage', 'Private Cinema', 'Botanical Gardens'],
    landmarks: [
      { name_en: 'UNESCO At-Turaif Heritage District', name_ar: 'حي الطريف التاريخي المسجل لدى اليونسكو', category: 'Entertainment', distance_km: 1.2, travel_time: '4 mins' },
    ],
    faqs: [
      { q_en: 'How does the development preserve Najdi heritage?', q_ar: 'كيف يحافظ المشروع على التراث النجدي؟', a_en: 'Built in partnership with Diriyah Gate Development Authority using authentic mudbrick facades and hand-carved stone.', a_ar: 'صُمم بالتعاون مع هيئة تطوير بوابة الدرعية باستخدام واجهات نجدیة واستخدام الأحجار المنحوتة يدوياً.' },
    ],
  },
  'red-sea-horizon-villas': {
    id: 'a1b2c3d4-0003-4000-8000-000000000003',
    slug: 'red-sea-horizon-villas',
    name_en: 'Red Sea Horizon Villas',
    name_ar: 'فلل أفق البحر الأحمر',
    location: 'Red Sea Coast, NEOM Region',
    starting_price: 18500000,
    category: 'Waterfront Sanctuaries',
    short_description_en: 'Overwater floating villas and coral reef beachfront sanctuaries engineered with zero-carbon marine design.',
    short_description_ar: 'فلل عائمة فوق الماء وملاذات شاطئية على الشعب المرجانية مصممة بهندسة بحرية خالية من الكربون.',
    full_description_en: 'Nestled along untouched turquoise waters, Red Sea Horizon Villas feature private yacht docks, glass underwater observation pods, solar microgrids, and 360-degree ocean views.',
    full_description_ar: 'تتميز فلل أفق البحر الأحمر الواقعة على المياه الفيروزية النقية بأرصفة يخوت خاصة، ومقصورات مشاهدة تحت الماء، وشبكات طاقة شمسية دقيقة، وإطلالات بانورامية على المحيط.',
    hero_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    gallery_images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Private Marina Berth', 'Underwater Observatory', 'Solar Power Grid', 'Helipad Access'],
    landmarks: [
      { name_en: 'Red Sea International Airport (RSI)', name_ar: 'مطار البحر الأحمر الدولي', category: 'Airport', distance_km: 18.0, travel_time: '15 mins' },
    ],
    faqs: [
      { q_en: 'What sustainability standards are implemented?', q_ar: 'ما هي معايير الاستدامة المطبقة؟', a_en: '100% renewable solar power microgrid and zero-discharge water reclamation.', a_ar: 'شبكة طاقة شمسية متجددة بنسبة ١٠٠٪ ونظام إعادة تدوير مياه خالي من الانبعاثات.' },
    ],
  },
};

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const dev = MOCK_DEVELOPMENTS_DB[slug];

  if (!dev) return { title: 'Development Not Found' };

  const isAr = locale === 'ar';
  const name = isAr ? dev.name_ar : dev.name_en;
  const desc = isAr ? dev.short_description_ar : dev.short_description_en;
  const baseUrl = 'https://neoma-residences.com';

  return {
    title: `${name} | NEOMA Masterplan`,
    description: desc,
    alternates: {
      canonical: `${baseUrl}/${locale}/developments/${slug}`,
      languages: {
        'en': `${baseUrl}/en/developments/${slug}`,
        'ar': `${baseUrl}/ar/developments/${slug}`,
        'x-default': `${baseUrl}/en/developments/${slug}`,
      },
    },
    openGraph: {
      title: name,
      description: desc,
      url: `${baseUrl}/${locale}/developments/${slug}`,
      images: [{ url: dev.hero_image }],
    },
  };
}

export default async function DevelopmentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const dev = MOCK_DEVELOPMENTS_DB[slug];

  if (!dev) {
    notFound();
  }

  const isAr = locale === 'ar';
  const name = isAr ? dev.name_ar : dev.name_en;
  const fullDesc = isAr ? dev.full_description_ar : dev.full_description_en;
  const baseUrl = 'https://neoma-residences.com';

  // Breadcrumb Schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Developments', item: `${baseUrl}/${locale}#developments` },
      { '@type': 'ListItem', position: 3, name: name, item: `${baseUrl}/${locale}/developments/${slug}` },
    ],
  };

  // FAQ Schema
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: dev.faqs.map((f: any) => ({
      '@type': 'Question',
      name: isAr ? f.q_ar : f.q_en,
      acceptedAnswer: { '@type': 'Answer', text: isAr ? f.a_ar : f.a_en },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="pt-24 pb-20 bg-neoma-black text-neoma-ivory">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <Link
            href={`/${locale}#developments`}
            className="inline-flex items-center gap-2 text-xs font-mono text-neoma-gold hover:underline"
          >
            <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            <span>{isAr ? 'العودة إلى المشاريع الأيقونية' : 'Back to Masterplans'}</span>
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="relative h-[60vh] w-full rounded-3xl overflow-hidden border border-neoma-gold/30 shadow-gold-glow">
            <Image
              src={dev.hero_image}
              alt={name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neoma-black via-neoma-black/30 to-transparent"></div>

            <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-neoma-gold text-neoma-black font-mono text-xs font-bold uppercase tracking-wider block w-fit mb-3">
                  {dev.category}
                </span>
                <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-neoma-ivory mb-2">
                  {name}
                </h1>
                <div className="flex items-center gap-2 text-xs font-mono text-neoma-gray-300">
                  <MapPin className="w-4 h-4 text-neoma-gold" />
                  <span>{dev.location}</span>
                </div>
              </div>

              <div className="text-left md:text-right">
                <span className="block text-xs font-mono text-neoma-gray-400 uppercase">
                  {isAr ? 'يبدأ من' : 'Starting From'}
                </span>
                <span className="text-3xl sm:text-4xl font-bold text-neoma-gold">
                  {formatCurrency(dev.starting_price, locale)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-8 space-y-12">
            {/* Story */}
            <div className="space-y-4">
              <h2 className="text-2xl font-playfair font-bold text-neoma-ivory">
                {isAr ? 'الرؤية المعمارية للمشروع' : 'Masterplan Architectural Vision'}
              </h2>
              <p className="text-neoma-gray-300 text-base leading-relaxed">
                {fullDesc}
              </p>
            </div>

            {/* Gallery */}
            <div className="space-y-4">
              <h2 className="text-2xl font-playfair font-bold text-neoma-ivory">
                {isAr ? 'معرض الصور المعمارية' : 'Architectural Gallery Showcase'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dev.gallery_images.map((img: string, i: number) => (
                  <div key={i} className="relative h-64 w-full rounded-2xl overflow-hidden glass-panel border-neoma-gold/20">
                    <Image src={img} alt="Gallery" fill className="object-cover hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Landmarks Map & Text List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-playfair font-bold text-neoma-ivory flex items-center gap-2">
                <Navigation className="w-5 h-5 text-neoma-gold" />
                <span>{isAr ? 'المعالم القريبة وإمكانية الوصول' : 'Key Nearby Landmarks & Accessibility'}</span>
              </h2>

              {/* Text-Based Accessible Landmark List */}
              <div className="glass-panel p-6 rounded-2xl space-y-3 border-neoma-gold/20">
                <span className="text-xs font-mono text-neoma-gold uppercase font-bold block mb-2">
                  Accessibility & Distances (Screen Reader Friendly List)
                </span>
                <ul className="space-y-2 text-xs font-mono text-neoma-gray-300">
                  {dev.landmarks.map((lm: any, idx: number) => (
                    <li key={idx} className="flex items-center justify-between p-2 rounded-lg bg-neoma-surface">
                      <span className="font-bold text-neoma-ivory">{isAr ? lm.name_ar : lm.name_en} ({lm.category})</span>
                      <span className="text-neoma-gold">{lm.distance_km} km ({lm.travel_time})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Investment Highlights with Mandatory Disclaimer */}
            <div className="glass-panel p-8 rounded-3xl border-neoma-emerald/40 space-y-4">
              <h2 className="text-2xl font-playfair font-bold text-neoma-ivory">
                {isAr ? 'المؤشرات الاستثمارية الرئيسية' : 'Investment Highlights'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center font-mono">
                <div className="p-4 rounded-xl bg-neoma-surface">
                  <span className="block text-[11px] text-neoma-gray-400">Est. Rental Yield</span>
                  <span className="text-xl font-bold text-neoma-emerald">7.5% p.a.</span>
                </div>
                <div className="p-4 rounded-xl bg-neoma-surface">
                  <span className="block text-[11px] text-neoma-gray-400">5-Yr Growth</span>
                  <span className="text-xl font-bold text-neoma-gold">+42%</span>
                </div>
                <div className="p-4 rounded-xl bg-neoma-surface">
                  <span className="block text-[11px] text-neoma-gray-400">Foreign Ownership</span>
                  <span className="text-xl font-bold text-neoma-ivory">Eligible</span>
                </div>
              </div>

              {/* Mandatory Financial Disclaimer */}
              <p className="text-[11px] font-mono text-neoma-gray-500 italic pt-2 border-t border-neoma-gold/10">
                * Figures are indicative estimates, not financial advice. Consult a licensed financial advisor before investing.
              </p>
            </div>

            {/* FAQ Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-playfair font-bold text-neoma-ivory flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-neoma-gold" />
                <span>{isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</span>
              </h2>
              <div className="space-y-4">
                {dev.faqs.map((f: any, i: number) => (
                  <div key={i} className="glass-panel p-6 rounded-2xl border-neoma-gold/20 space-y-2">
                    <h4 className="font-playfair font-bold text-neoma-gold text-base">{isAr ? f.q_ar : f.q_en}</h4>
                    <p className="text-xs text-neoma-gray-300 leading-relaxed">{isAr ? f.a_ar : f.a_en}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Advisory Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28">
              <PrivateConsultationForm locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
