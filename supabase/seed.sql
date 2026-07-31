-- NEOMA Residences — Supabase Seed Data (Phases 1, 2, and 3)

-- Insert Sample Developments
INSERT INTO public.developments (
  id, slug, name_en, name_ar, location, starting_price, category,
  short_description_en, short_description_ar, full_description_en, full_description_ar,
  hero_image, gallery_images, amenities, coordinates, featured
) VALUES
(
  'a1b2c3d4-0001-4000-8000-000000000001',
  'the-obsidian-tower-riyadh',
  'The Obsidian Tower',
  'برج الأوبسيديان الرياض',
  'KAFD, Riyadh',
  12500000.00,
  'Ultra-Luxury Tower',
  'Rising 85 stories above King Abdullah Financial District, offering bespoke skyline residences with private helipads.',
  'يرتفع ٨٥ طابقاً فوق مركز الملك عبد الله المالي، ويقدم وحدات سكنية فاخرة مطلة على الأفق مع مهابط طائرات خاصة.',
  'The Obsidian Tower redefines Saudi high-rise architecture. Featuring double-height living spaces, floor-to-ceiling smart glass, private infinity dip pools on every terrace, and dedicated butler services, it is the pinnacle of modern Arabian luxury.',
  'يعيد برج الأوبسيديان تعريف الهندسة المعمارية للأبراج في المملكة. يتميز بمساحات معيشة بارتفاع مضاعف، وزجاج ذكي من الأرضية حتى السقف، وأحواض سباحة خاصة في كل شرفة، بالإضافة إلى خدمات خادم شخصي مخصصة.',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY['Private Helipad', 'Infinity Pool', 'Bespoke Butler', 'Private Spa & Sauna', 'Automated Parking', 'Sommelier Lounge'],
  '{"lat": 24.7636, "lng": 46.6433}'::jsonb,
  true
),
(
  'a1b2c3d4-0002-4000-8000-000000000002',
  'diriyah-royal-estates',
  'Diriyah Royal Estates',
  'قصور الدرعية الملكية',
  'Historic Diriyah, Riyadh',
  28000000.00,
  'Heritage Villa Estate',
  'Exclusive Najdi-inspired royal estates surrounded by ancient date palms and UNESCO World Heritage landmarks.',
  'قصور ملكية مستوحاة من الطراز النجدي تحيط بها نخيل التمر الأثرية ومعالم اليونسكو للتراث العالمي.',
  'Combining 300 years of Najdi heritage with modern sustainable engineering, Diriyah Royal Estates offers gated privacy, private equestrian facilities, subterranean motor galleries, and hand-carved stone craftsmanship.',
  'تجمع قصور الدرعية الملكية بين ٣٠٠ عام من التراث النجدي والهندسة المستدامة الحديثة، وتوفر خصوصية مطلقة، ومرافق فروسية خاصة، ومقرات عرض سيارات تحت الأرض، ومصنوعات حجرية منحوتة يدوياً.',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY['Private Stables', 'Najdi Courtyard', 'Subterranean Garage', 'Private Cinema', 'Botanical Gardens'],
  '{"lat": 24.7331, "lng": 46.5744}'::jsonb,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Sample 3D Media Asset Row (Matterport Link + Real Fallback Image URL)
INSERT INTO public.development_media_3d (
  id, development_id, asset_type, storage_path, external_url, is_mobile_fallback, fallback_image_url
) VALUES
(
  'e1f2a3b4-0001-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'matterport_link',
  NULL,
  'https://my.matterport.com/show/?m=sample_obsidian_tower',
  true,
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85'
)
ON CONFLICT DO NOTHING;

-- Insert Sample Admin & Agent Users
INSERT INTO public.admin_users (id, user_id, role) VALUES
('f1a2b3c4-0001-4000-8000-000000000001', '00000000-0000-0000-0000-000000000001', 'super_admin'),
('f1a2b3c4-0002-4000-8000-000000000002', '00000000-0000-0000-0000-000000000002', 'agent')
ON CONFLICT (user_id) DO NOTHING;
