import { setRequestLocale } from 'next-intl/server';
import ExploreContainerClient from '@/components/explore/ExploreContainerClient';

const MOCK_EXPLORE_PROPERTIES = [
  {
    id: 'b1c2d3e4-0001-4000-8000-000000000001',
    slug: 'the-sky-penthouse-obsidian',
    title_en: 'The Imperial Sky Penthouse',
    title_ar: 'البنتهاوس الملكي في السماء',
    property_type: 'Penthouse',
    bedrooms: 5,
    bathrooms: 7,
    area: 1450,
    price: 45000000,
    status: 'available',
    hero_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'b1c2d3e4-0002-4000-8000-000000000002',
    slug: 'royal-diriyah-palace-estate',
    title_en: 'The Royal Oasis Estate',
    title_ar: 'قصر الواحة الملكي',
    property_type: 'Villa',
    bedrooms: 7,
    bathrooms: 9,
    area: 2800,
    price: 68000000,
    status: 'available',
    hero_image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'b1c2d3e4-0003-4000-8000-000000000003',
    slug: 'coral-sanctuary-overwater-villa',
    title_en: 'Coral Sanctuary Villa',
    title_ar: 'فيلا ملاذ المرجان العائمة',
    property_type: 'Villa',
    bedrooms: 4,
    bathrooms: 5,
    area: 950,
    price: 24500000,
    status: 'available',
    hero_image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const baseUrl = 'https://neoma-residences.com';

  return {
    title: isAr ? 'المستكشف المعماري ثلاثي الأبعاد | نيوما رزيدنسز' : 'Interactive 3D Building & Masterplan Explorer | NEOMA Residences',
    description: isAr
      ? 'استكشف أبراج نيوما والفلل الملكية عبر المحاكاة المعمارية ثلاثية الأبعاد.'
      : 'Explore NEOMA masterplans, floor elevations, and private unit tiers via interactive 3D WebGL technology.',
    alternates: {
      canonical: `${baseUrl}/${locale}/explore`,
      languages: {
        'en': `${baseUrl}/en/explore`,
        'ar': `${baseUrl}/ar/explore`,
        'x-default': `${baseUrl}/en/explore`,
      },
    },
  };
}

export default async function ExplorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-24 pb-20 bg-neoma-black text-neoma-ivory px-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-4 py-1.5 rounded-full border border-neoma-gold/30 text-neoma-gold text-xs font-mono tracking-widest uppercase">
            3D Architectural Technology
          </span>
          <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-gold-gradient">
            {locale === 'ar' ? 'مستكشف نيوما ثلاثي الأبعاد' : '3D Masterplan & Building Explorer'}
          </h1>
        </div>

        <ExploreContainerClient locale={locale} properties={MOCK_EXPLORE_PROPERTIES} />
      </div>
    </div>
  );
}
