import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { formatCurrency, formatNumber } from '@/i18n/formatters';
import PropertyInquiryForm from '@/components/properties/PropertyInquiryForm';
import PropertyDetailActions from '@/components/properties/PropertyDetailActions';
import VirtualTourViewer from '@/components/properties/VirtualTourViewer';
import { Bed, Bath, Maximize2, MapPin, ShieldCheck, ArrowLeft } from 'lucide-react';

const MOCK_PROPERTIES_DB: Record<string, any> = {
  'the-sky-penthouse-obsidian': {
    id: 'b1c2d3e4-0001-4000-8000-000000000001',
    slug: 'the-sky-penthouse-obsidian',
    title_en: 'The Imperial Sky Penthouse',
    title_ar: 'البنتهاوس الملكي في السماء',
    development_id: 'a1b2c3d4-0001-4000-8000-000000000001',
    development_name_en: 'The Obsidian Tower',
    development_name_ar: 'برج الأوبسيديان',
    location: 'KAFD, Riyadh',
    property_type: 'Penthouse',
    bedrooms: 5,
    bathrooms: 7,
    area: 1450,
    price: 45000000,
    status: 'available',
    hero_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    gallery_images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    ],
    floor_plan: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
    description_en: 'Occupying the top three floors of The Obsidian Tower, The Imperial Sky Penthouse represents the apex of high-rise luxury in King Abdullah Financial District.',
    description_ar: 'يحتل البنتهاوس الملكي في السماء الطوابق الثلاثة العليا في برج الأوبسيديان، ويمثل قمة الفخامة في مركز الملك عبد الله المالي.',
    amenities: ['Private Glass Elevator', 'Heated Sky Pool', 'Royal Butler Quarters', 'Sommelier Lounge', 'Private Helipad Access'],
    featured: true,
  },
  'royal-diriyah-palace-estate': {
    id: 'b1c2d3e4-0002-4000-8000-000000000002',
    slug: 'royal-diriyah-palace-estate',
    title_en: 'The Royal Oasis Estate',
    title_ar: 'قصر الواحة الملكي',
    development_id: 'a1b2c3d4-0002-4000-8000-000000000002',
    development_name_en: 'Diriyah Royal Estates',
    development_name_ar: 'قصور الدرعية الملكية',
    location: 'Historic Diriyah, Riyadh',
    property_type: 'Villa',
    bedrooms: 7,
    bathrooms: 9,
    area: 2800,
    price: 68000000,
    status: 'available',
    hero_image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    gallery_images: [],
    floor_plan: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
    description_en: 'A monumental palace estate in historic Diriyah blending 300 years of Najdi heritage with modern grand reception halls.',
    description_ar: 'قصر ملكي مهيب في الدرعية التاريخية يمزج ٣٠٠ عام من التراث النجدي مع قاعات الاستقبال الفاخرة.',
    amenities: ['Najdi Courtyard', 'Subterranean Motor Gallery', 'Private Security Pavilion', 'Equestrian Stables'],
    featured: true,
  },
  'coral-sanctuary-overwater-villa': {
    id: 'b1c2d3e4-0003-4000-8000-000000000003',
    slug: 'coral-sanctuary-overwater-villa',
    title_en: 'Coral Sanctuary Villa',
    title_ar: 'فيلا ملاذ المرجان العائمة',
    development_id: 'a1b2c3d4-0003-4000-8000-000000000003',
    development_name_en: 'Red Sea Horizon Villas',
    development_name_ar: 'فلل أفق البحر الأحمر',
    location: 'Red Sea Coast, NEOM Region',
    property_type: 'Villa',
    bedrooms: 4,
    bathrooms: 5,
    area: 950,
    price: 24500000,
    status: 'available',
    hero_image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85',
    gallery_images: [],
    floor_plan: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
    description_en: 'Overwater luxury ocean sanctuary featuring direct coral lagoon access, glass flooring panels, underwater suite.',
    description_ar: 'ملاذ بحري فاخر عائم على الماء يتميز بمدخل مباشر إلى بحيرة الشعب المرجانية.',
    amenities: ['Private Yacht Slip', 'Underwater Observation Suite', 'Solar Power Grid'],
    featured: true,
  },
};

// Rule-based Related Properties Algorithm (same dev OR same type within +-20% price, ranked by featured)
function getRelatedProperties(current: any) {
  const all = Object.values(MOCK_PROPERTIES_DB).filter((p) => p.id !== current.id);
  const minPrice = current.price * 0.8;
  const maxPrice = current.price * 1.2;

  const matches = all.filter((p) => {
    const isSameDev = p.development_id === current.development_id;
    const isSameTypeInPrice = p.property_type === current.property_type && p.price >= minPrice && p.price <= maxPrice;
    return isSameDev || isSameTypeInPrice;
  });

  // Fallback to remaining items if matches < 2
  const results = matches.length >= 2 ? matches : all;
  return results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).slice(0, 2);
}

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const property = MOCK_PROPERTIES_DB[slug];

  if (!property) return { title: 'Property Not Found' };

  const isAr = locale === 'ar';
  const title = isAr ? property.title_ar : property.title_en;
  const desc = isAr ? property.description_ar : property.description_en;
  const baseUrl = 'https://neoma-residences.com';

  return {
    title: `${title} | NEOMA Residences`,
    description: desc,
    alternates: {
      canonical: `${baseUrl}/${locale}/properties/${slug}`,
      languages: {
        'en': `${baseUrl}/en/properties/${slug}`,
        'ar': `${baseUrl}/ar/properties/${slug}`,
        'x-default': `${baseUrl}/en/properties/${slug}`,
      },
    },
    openGraph: {
      title,
      description: desc,
      url: `${baseUrl}/${locale}/properties/${slug}`,
      images: [{ url: property.hero_image }],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const property = MOCK_PROPERTIES_DB[slug];

  if (!property) {
    notFound();
  }

  const isAr = locale === 'ar';
  const title = isAr ? property.title_ar : property.title_en;
  const desc = isAr ? property.description_ar : property.description_en;
  const devName = isAr ? property.development_name_ar : property.development_name_en;

  const related = getRelatedProperties(property);
  const baseUrl = 'https://neoma-residences.com';

  // Breadcrumb Schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Properties',
        item: `${baseUrl}/${locale}/properties`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${baseUrl}/${locale}/properties/${slug}`,
      },
    ],
  };

  // Property Schema
  const propertyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description: desc,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'SAR',
    },
    image: property.hero_image,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
      />

      <div className="pt-24 pb-20 bg-neoma-black text-neoma-ivory">
        <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between">
          <Link
            href={`/${locale}/properties`}
            className="inline-flex items-center gap-2 text-xs font-mono text-neoma-gold hover:underline"
          >
            <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            <span>{isAr ? 'العودة إلى دليل الوحدات' : 'Back to Residences Search'}</span>
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="relative h-[60vh] w-full rounded-3xl overflow-hidden border border-neoma-gold/30 shadow-gold-glow">
            <Image
              src={property.hero_image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neoma-black via-neoma-black/30 to-transparent"></div>

            <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-neoma-gold text-neoma-black font-mono text-xs font-bold uppercase tracking-wider block w-fit mb-3">
                  {property.property_type} • {devName}
                </span>
                <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-neoma-ivory mb-2">
                  {title}
                </h1>
                <div className="flex items-center gap-2 text-xs font-mono text-neoma-gray-300">
                  <MapPin className="w-4 h-4 text-neoma-gold" />
                  <span>{property.location}</span>
                </div>
              </div>

              <div className="text-left md:text-right">
                <span className="block text-xs font-mono text-neoma-gray-400 uppercase">
                  {isAr ? 'السعر المطلوب' : 'Asking Price'}
                </span>
                <span className="text-3xl sm:text-4xl font-bold text-neoma-gold">
                  {formatCurrency(property.price, locale)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Interactive Actions */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-8 space-y-12">
            <div className="glass-panel p-6 rounded-2xl grid grid-cols-3 gap-4 border-neoma-gold/20 text-center">
              <div>
                <span className="block text-xs font-mono text-neoma-gray-400 uppercase mb-1">Bedrooms</span>
                <span className="text-xl font-bold text-neoma-gold flex items-center justify-center gap-2">
                  <Bed className="w-5 h-5" />
                  {formatNumber(property.bedrooms, locale)}
                </span>
              </div>
              <div>
                <span className="block text-xs font-mono text-neoma-gray-400 uppercase mb-1">Bathrooms</span>
                <span className="text-xl font-bold text-neoma-gold flex items-center justify-center gap-2">
                  <Bath className="w-5 h-5" />
                  {formatNumber(property.bathrooms, locale)}
                </span>
              </div>
              <div>
                <span className="block text-xs font-mono text-neoma-gray-400 uppercase mb-1">Built Area</span>
                <span className="text-xl font-bold text-neoma-gold flex items-center justify-center gap-2">
                  <Maximize2 className="w-5 h-5" />
                  {formatNumber(property.area, locale)} m²
                </span>
              </div>
            </div>

            {/* Client CTAs for Viewing & Brochure */}
            <PropertyDetailActions
              locale={locale}
              propertyId={property.id}
              propertyTitle={title}
            />

            {/* 360 Virtual Tour */}
            <div className="space-y-4">
              <h2 className="text-2xl font-playfair font-bold text-neoma-ivory">
                {isAr ? 'الجولة الافتراضية ٣٦٠ درجة' : 'Interactive 360° Virtual Tour'}
              </h2>
              <VirtualTourViewer locale={locale} propertyTitle={title} />
            </div>

            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-playfair font-bold text-neoma-ivory">
                {isAr ? 'الوصف المعماري' : 'Architectural Overview'}
              </h2>
              <p className="text-neoma-gray-300 text-base leading-relaxed">
                {desc}
              </p>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h2 className="text-2xl font-playfair font-bold text-neoma-ivory">
                {isAr ? 'المرافق والتسهيلات' : 'Bespoke Amenities'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.map((item: string, i: number) => (
                  <div key={i} className="glass-panel p-4 rounded-xl border-neoma-gold/20 flex items-center gap-3 text-sm text-neoma-ivory">
                    <ShieldCheck className="w-4 h-4 text-neoma-gold" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Properties */}
            {related.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-neoma-gold/20">
                <h2 className="text-2xl font-playfair font-bold text-neoma-ivory">
                  {isAr ? 'وحدات سكنية مماثلة' : 'Related Sanctuaries'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {related.map((rel: any) => (
                    <Link
                      key={rel.id}
                      href={`/${locale}/properties/${rel.slug}`}
                      className="glass-panel p-4 rounded-2xl border-neoma-gold/20 hover:border-neoma-gold transition-all block group"
                    >
                      <div className="relative h-40 w-full rounded-xl overflow-hidden mb-3">
                        <Image src={rel.hero_image} alt={rel.title_en} fill className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <h4 className="font-playfair font-bold text-neoma-ivory text-base group-hover:text-neoma-gold">
                        {isAr ? rel.title_ar : rel.title_en}
                      </h4>
                      <span className="text-sm font-bold text-neoma-gold block mt-1">
                        {formatCurrency(rel.price, locale)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Direct Property Inquiry Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28">
              <PropertyInquiryForm
                locale={locale}
                propertyId={property.id}
                propertyTitle={title}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
