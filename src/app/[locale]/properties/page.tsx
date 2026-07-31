import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { formatCurrency, formatNumber } from '@/i18n/formatters';
import PropertyExplorerClient from '@/components/properties/PropertyExplorerClient';
import { Bed, Bath, Maximize2, Search, SlidersHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';

const MOCK_PROPERTIES_CATALOG = [
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
    description_en: 'Triplex penthouse occupying the top three floors of The Obsidian Tower in KAFD Riyadh.',
    description_ar: 'بنتهاوس مكون من ثلاثة طوابق يحتل الطوابق الثلاثة العليا في برج الأوبسيديان.',
    featured: true,
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
    description_en: 'A monumental estate in historic Diriyah blending royal Najdi heritage with grand halls.',
    description_ar: 'قصر ملكي مهيب في الدرعية التاريخية يمزج التراث النجدي الملكي مع قاعات الاستقبال.',
    featured: true,
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
    description_en: 'Overwater luxury ocean sanctuary featuring direct coral lagoon access.',
    description_ar: 'ملاذ بحري فاخر عائم على الماء يتميز بمدخل مباشر إلى بحيرة الشعب المرجانية.',
    featured: true,
  },
];

export const revalidate = 1800;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const baseUrl = 'https://neoma-residences.com';

  return {
    title: isAr ? 'استكشاف الوحدات السكنية والقصور الفاخرة | نيوما رزيدنسز' : 'Explore Luxury Residences & Royal Estates | NEOMA Residences',
    description: isAr
      ? 'تصفح محفظة الفلل والقصور والبنتهاوس الفاخرة في الرياض والدرعية والبحر الأحمر.'
      : 'Browse our portfolio of luxury villas, sky penthouses, and royal estates across Saudi Arabia.',
    alternates: {
      canonical: `${baseUrl}/${locale}/properties`,
      languages: {
        'en': `${baseUrl}/en/properties`,
        'ar': `${baseUrl}/ar/properties`,
        'x-default': `${baseUrl}/en/properties`,
      },
    },
  };
}

export default async function PropertiesSearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; bedrooms?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { type, bedrooms, page } = await searchParams;
  setRequestLocale(locale);

  const currentPage = Number(page) || 1;
  const targetType = type || 'all';

  // Server-side filtering
  let filtered = MOCK_PROPERTIES_CATALOG;
  if (targetType !== 'all') {
    filtered = filtered.filter((p) => p.property_type.toLowerCase() === targetType.toLowerCase());
  }
  if (bedrooms) {
    filtered = filtered.filter((p) => p.bedrooms >= Number(bedrooms));
  }

  return (
    <div className="pt-28 pb-20 bg-neoma-black text-neoma-ivory px-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full border border-neoma-gold/30 text-neoma-gold text-xs font-mono tracking-widest uppercase">
            Private Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-gold-gradient">
            {locale === 'ar' ? 'الوحدات السكنية الفاخرة' : 'Private Luxury Residences'}
          </h1>
          <p className="text-neoma-gray-300 text-sm">
            {locale === 'ar'
              ? 'تصفح وفلتر محفظة نيوما الحصرية للفلل والبنتهاوس والقصور الملكية.'
              : 'Filter and discover bespoke villas, sky penthouses, and royal estates engineered across Saudi Arabia.'}
          </p>
        </div>

        {/* Interactive Search & Filter Component */}
        <PropertyExplorerClient
          locale={locale}
          properties={filtered}
          initialType={targetType}
          initialBedrooms={bedrooms || ''}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
