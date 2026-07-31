import { setRequestLocale } from 'next-intl/server';
import CinematicHero from '@/components/home/CinematicHero';
import SignatureDevelopments from '@/components/home/SignatureDevelopments';
import LifestyleExperience from '@/components/home/LifestyleExperience';
import PropertyExplorer from '@/components/home/PropertyExplorer';
import InvestmentIntelligence from '@/components/home/InvestmentIntelligence';
import ArchitectureVision from '@/components/home/ArchitectureVision';
import LocationIntelligence from '@/components/home/LocationIntelligence';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';
import PrivateConsultationForm from '@/components/home/PrivateConsultationForm';

// Mock Seed Fallbacks if database has not been seeded yet
const MOCK_DEVELOPMENTS = [
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000001',
    slug: 'the-obsidian-tower-riyadh',
    name_en: 'The Obsidian Tower',
    name_ar: 'برج الأوبسيديان الرياض',
    location: 'KAFD, Riyadh',
    starting_price: 12500000,
    category: 'Ultra-Luxury Tower',
    short_description_en: 'Rising 85 stories above King Abdullah Financial District, offering bespoke skyline residences with private helipads.',
    short_description_ar: 'يرتفع ٨٥ طابقاً فوق مركز الملك عبد الله المالي، ويقدم وحدات سكنية فاخرة مطلة على الأفق مع مهابط طائرات خاصة.',
    hero_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
    amenities: ['Private Helipad', 'Infinity Pool', 'Bespoke Butler'],
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-000000000002',
    slug: 'diriyah-royal-estates',
    name_en: 'Diriyah Royal Estates',
    name_ar: 'قصور الدرعية الملكية',
    location: 'Historic Diriyah, Riyadh',
    starting_price: 28000000,
    category: 'Heritage Villa Estate',
    short_description_en: 'Exclusive Najdi-inspired royal estates surrounded by ancient date palms and UNESCO World Heritage landmarks.',
    short_description_ar: 'قصور ملكية مستوحاة من الطراز النجدي تحيط بها نخيل التمر الأثرية ومعالم اليونسكو للتراث العالمي.',
    hero_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    amenities: ['Private Stables', 'Najdi Courtyard', 'Subterranean Garage'],
  },
  {
    id: 'a1b2c3d4-0003-4000-8000-000000000003',
    slug: 'red-sea-horizon-villas',
    name_en: 'Red Sea Horizon Villas',
    name_ar: 'فلل أفق البحر الأحمر',
    location: 'Red Sea Coast, NEOM Region',
    starting_price: 18500000,
    category: 'Waterfront Sanctuaries',
    short_description_en: 'Overwater floating villas and coral reef beachfront sanctuaries engineered with zero-carbon marine design.',
    short_description_ar: 'فلل عائمة فوق الماء وملاذات شاطئية على الشعب المرجانية مصممة بهندسة بحرية خالية من الكربون.',
    hero_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    amenities: ['Private Marina Berth', 'Underwater Observatory', 'Solar Grid'],
  },
];

const MOCK_PROPERTIES = [
  {
    id: 'b1c2d3e4-0001-4000-8000-000000000001',
    slug: 'the-sky-penthouse-obsidian',
    development_id: 'a1b2c3d4-0001-4000-8000-000000000001',
    title_en: 'The Imperial Sky Penthouse',
    title_ar: 'البنتهاوس الملكي في السماء',
    property_type: 'Penthouse',
    bedrooms: 5,
    bathrooms: 7,
    area: 1450,
    price: 45000000,
    status: 'available',
    hero_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [],
    description_en: 'Triplex penthouse occupying the top three floors of The Obsidian Tower, complete with private glass elevator and heated sky pool.',
    description_ar: 'بنتهاوس مكون من ثلاثة طوابق يحتل الطوابق الثلاثة العليا في برج الأوبسيديان، مجهز بمصعد زجاجي خاص ومسبح معلق.',
    featured: true,
  },
  {
    id: 'b1c2d3e4-0002-4000-8000-000000000002',
    slug: 'royal-diriyah-palace-estate',
    development_id: 'a1b2c3d4-0002-4000-8000-000000000002',
    title_en: 'The Royal Oasis Estate',
    title_ar: 'قصر الواحة الملكي',
    property_type: 'Villa',
    bedrooms: 7,
    bathrooms: 9,
    area: 2800,
    price: 68000000,
    status: 'available',
    hero_image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [],
    description_en: 'A monumental estate in historic Diriyah blending royal Najdi heritage with modern grand halls and private security pavilion.',
    description_ar: 'قصر ملكي مهيب في الدرعية التاريخية يمزج التراث النجدي الملكي مع قاعات الاستقبال الفاخرة ومجمع حراسة أمني خاص.',
    featured: true,
  },
  {
    id: 'b1c2d3e4-0003-4000-8000-000000000003',
    slug: 'coral-sanctuary-overwater-villa',
    development_id: 'a1b2c3d4-0003-4000-8000-000000000003',
    title_en: 'Coral Sanctuary Villa',
    title_ar: 'فيلا ملاذ المرجان العائمة',
    property_type: 'Villa',
    bedrooms: 4,
    bathrooms: 5,
    area: 950,
    price: 24500000,
    status: 'available',
    hero_image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [],
    description_en: 'Overwater luxury ocean sanctuary featuring direct coral lagoon access, glass flooring panels, and private yacht slip.',
    description_ar: 'ملاذ بحري فاخر عائم على الماء يتميز بمدخل مباشر إلى بحيرة الشعب المرجانية وأرضيات زجاجية ورصيف يخت خاص.',
    featured: true,
  },
];

const MOCK_TESTIMONIALS = [
  {
    id: 'c1d2e3f4-0001-4000-8000-000000000001',
    client_name: 'H.E. Sheikh Faisal Al-Otaibi',
    nationality: 'Saudi Arabia',
    development: 'The Obsidian Tower',
    rating: 5,
    quote_en: 'NEOMA Residences has redefined architectural elegance in Riyadh. The attention to detail and level of privacy at The Obsidian Tower is unparalleled in the region.',
    quote_ar: 'لقد أعادت نيوما رزيدنسز تعريف الفخامة المعمارية في الرياض. الاهتمام بالتفاصيل ومستوى الخصوصية في برج الأوبسيديان لا مثيل له في المنطقة.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    featured: true,
  },
  {
    id: 'c1d2e3f4-0002-4000-8000-000000000002',
    client_name: 'Lord Charles Kensington',
    nationality: 'United Kingdom',
    development: 'Diriyah Royal Estates',
    rating: 5,
    quote_en: 'As an international investor, acquiring a residence at Diriyah Royal Estates was an extraordinary decision. The blend of Saudi heritage and world-class luxury is astounding.',
    quote_ar: 'كمستثمر دولي، كان اقتناء مقر إقامة في قصور الدرعية الملكية قراراً استثنائياً. المزيج بين التراث السعودي والفخامة العالمية مذهل للغاية.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    featured: true,
  },
];

export const revalidate = 1800; // 30 minutes caching

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-0">
      <CinematicHero locale={locale} />
      <SignatureDevelopments locale={locale} developments={MOCK_DEVELOPMENTS} />
      <LifestyleExperience locale={locale} />
      <PropertyExplorer locale={locale} properties={MOCK_PROPERTIES} />
      <InvestmentIntelligence locale={locale} />
      <ArchitectureVision locale={locale} />
      <LocationIntelligence locale={locale} />
      <TestimonialsCarousel locale={locale} testimonials={MOCK_TESTIMONIALS} />
      <PrivateConsultationForm locale={locale} />
    </div>
  );
}
