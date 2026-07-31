-- NEOMA Residences — Supabase Database DDL & RLS Security Schema (Phases 1, 2, and 3)

-- Create Custom ENUM Types
CREATE TYPE lead_status_type AS ENUM ('new', 'engaged', 'qualified', 'consultation_requested', 'booked', 'closed');
CREATE TYPE admin_role_type AS ENUM ('super_admin', 'content_manager', 'agent');
CREATE TYPE inquiry_status_type AS ENUM ('new', 'contacted', 'qualified', 'closed');
CREATE TYPE viewing_status_type AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE whatsapp_message_type AS ENUM ('property_inquiry', 'consultation', 'investment', 'brochure');
CREATE TYPE followup_status_type AS ENUM ('pending', 'contacted', 'qualified', 'booked', 'closed');

-- 1. Developments Table
CREATE TABLE IF NOT EXISTS public.developments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  location TEXT NOT NULL,
  starting_price NUMERIC(15, 2) NOT NULL,
  category TEXT NOT NULL DEFAULT 'Residential Tower',
  short_description_en TEXT NOT NULL,
  short_description_ar TEXT NOT NULL,
  full_description_en TEXT NOT NULL,
  full_description_ar TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  coordinates JSONB DEFAULT '{"lat": 24.7136, "lng": 46.6753}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  development_id UUID REFERENCES public.developments(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  property_type TEXT NOT NULL,
  bedrooms INT NOT NULL DEFAULT 1,
  bathrooms INT NOT NULL DEFAULT 1,
  area NUMERIC(10, 2) NOT NULL,
  price NUMERIC(15, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  hero_image TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT '{}',
  floor_plan TEXT,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  nationality TEXT NOT NULL,
  development TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  quote_en TEXT NOT NULL,
  quote_ar TEXT NOT NULL,
  avatar TEXT,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Consultation Requests Table
CREATE TABLE IF NOT EXISTS public.consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  property_interest TEXT,
  preferred_date DATE,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AI Conversations Table
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  messages JSONB DEFAULT '[]'::jsonb,
  lead_status lead_status_type DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  role admin_role_type DEFAULT 'content_manager',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Development Landmarks Table (Phase 2)
CREATE TABLE IF NOT EXISTS public.development_landmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  development_id UUID REFERENCES public.developments(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  category TEXT NOT NULL,
  distance_km NUMERIC(5, 2) NOT NULL,
  travel_time TEXT NOT NULL,
  coordinates JSONB DEFAULT '{"lat": 24.7136, "lng": 46.6753}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Property Inquiries Table (Phase 2)
CREATE TABLE IF NOT EXISTS public.property_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  device_type TEXT DEFAULT 'desktop',
  status inquiry_status_type DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Brochure Downloads Table (Phase 2)
CREATE TABLE IF NOT EXISTS public.brochure_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  development_id UUID REFERENCES public.developments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  marketing_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Private Viewings Table (Phase 2)
CREATE TABLE IF NOT EXISTS public.private_viewings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  notes TEXT,
  status viewing_status_type DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. WhatsApp Leads Table (Phase 2)
CREATE TABLE IF NOT EXISTS public.whatsapp_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_page TEXT NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  message_type whatsapp_message_type DEFAULT 'property_inquiry',
  device_type TEXT DEFAULT 'desktop',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Development 3D Media Table (Phase 3)
CREATE TABLE IF NOT EXISTS public.development_media_3d (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  development_id UUID REFERENCES public.developments(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('gltf', 'glb', '360_photo', 'matterport_link')),
  storage_path TEXT,
  external_url TEXT,
  is_mobile_fallback BOOLEAN DEFAULT false,
  fallback_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. User Sessions Table (Phase 3)
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  country TEXT,
  language TEXT,
  device_type TEXT DEFAULT 'desktop',
  source TEXT,
  viewed_properties TEXT[] DEFAULT '{}',
  viewed_developments TEXT[] DEFAULT '{}',
  consent_given BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AI Recommendations Table (Phase 3)
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  recommended_properties TEXT[] DEFAULT '{}',
  reasoning_summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Consultation Followups Table (Phase 3)
CREATE TABLE IF NOT EXISTS public.consultation_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES public.consultation_requests(id) ON DELETE CASCADE,
  status followup_status_type DEFAULT 'pending',
  notes TEXT,
  assigned_agent_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  crm_external_id TEXT,
  crm_sync_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
--------------------------------------------------------------------------------

ALTER TABLE public.developments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brochure_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_viewings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_media_3d ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_followups ENABLE ROW LEVEL SECURITY;

-- Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_agent()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND role = 'agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 1 & 2 Policies
CREATE POLICY "Public developments select" ON public.developments FOR SELECT USING (true);
CREATE POLICY "Admin developments insert" ON public.developments FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin developments update" ON public.developments FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin developments delete" ON public.developments FOR DELETE USING (public.is_admin());

CREATE POLICY "Public properties select" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Admin properties insert" ON public.properties FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin properties update" ON public.properties FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin properties delete" ON public.properties FOR DELETE USING (public.is_admin());

CREATE POLICY "Public featured testimonials select" ON public.testimonials FOR SELECT USING (featured = true OR public.is_admin());
CREATE POLICY "Admin testimonials insert" ON public.testimonials FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin testimonials update" ON public.testimonials FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin testimonials delete" ON public.testimonials FOR DELETE USING (public.is_admin());

CREATE POLICY "Public landmarks select" ON public.development_landmarks FOR SELECT USING (true);
CREATE POLICY "Admin landmarks manage" ON public.development_landmarks FOR ALL USING (public.is_admin());

CREATE POLICY "Public consultation insert" ON public.consultation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin consultation select" ON public.consultation_requests FOR SELECT USING (public.is_admin());

CREATE POLICY "Public inquiry insert" ON public.property_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin inquiry select" ON public.property_inquiries FOR SELECT USING (public.is_admin());

CREATE POLICY "Public brochure insert" ON public.brochure_downloads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin brochure select" ON public.brochure_downloads FOR SELECT USING (public.is_admin());

CREATE POLICY "Public viewing insert" ON public.private_viewings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin viewing select" ON public.private_viewings FOR SELECT USING (public.is_admin());

CREATE POLICY "Public whatsapp_lead insert" ON public.whatsapp_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin whatsapp_lead select" ON public.whatsapp_leads FOR SELECT USING (public.is_admin());

-- Phase 3 Policies
CREATE POLICY "Public 3d_media select" ON public.development_media_3d FOR SELECT USING (true);
CREATE POLICY "Admin 3d_media manage" ON public.development_media_3d FOR ALL USING (public.is_admin());

-- user_sessions: Public INSERT (consent-gated at app layer), Admin SELECT/UPDATE
CREATE POLICY "Public user_sessions insert" ON public.user_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin user_sessions select" ON public.user_sessions FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin user_sessions update" ON public.user_sessions FOR UPDATE USING (public.is_admin());

-- ai_recommendations: Anonymous INSERT blocked, Admin SELECT
CREATE POLICY "Admin ai_recommendations select" ON public.ai_recommendations FOR SELECT USING (public.is_admin());

-- consultation_followups: Agents SELECT/UPDATE assigned, Super Admin Full CRUD
CREATE POLICY "Agent assigned followups select" ON public.consultation_followups FOR SELECT USING (
  assigned_agent_id IN (SELECT id FROM public.admin_users WHERE user_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Agent assigned followups update" ON public.consultation_followups FOR UPDATE USING (
  assigned_agent_id IN (SELECT id FROM public.admin_users WHERE user_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Admin followups manage" ON public.consultation_followups FOR ALL USING (public.is_admin());

--------------------------------------------------------------------------------
-- SUPABASE STORAGE BUCKETS SETUP
--------------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public) VALUES ('developments-media', 'developments-media', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('properties-media', 'properties-media', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonials', 'testimonials', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('brochures', 'brochures', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('floorplans', 'floorplans', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('developments-3d', 'developments-3d', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('virtual-tours', 'virtual-tours', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Public storage view developments-media" ON storage.objects FOR SELECT USING (bucket_id = 'developments-media');
CREATE POLICY "Public storage view properties-media" ON storage.objects FOR SELECT USING (bucket_id = 'properties-media');
CREATE POLICY "Public storage view testimonials" ON storage.objects FOR SELECT USING (bucket_id = 'testimonials');
CREATE POLICY "Public storage view developments-3d" ON storage.objects FOR SELECT USING (bucket_id = 'developments-3d');
CREATE POLICY "Public storage view virtual-tours" ON storage.objects FOR SELECT USING (bucket_id = 'virtual-tours');

CREATE POLICY "Admin upload objects" ON storage.objects FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete objects" ON storage.objects FOR DELETE USING (public.is_admin());

-- 16. Email Unsubscribes Table (Phase 3)
CREATE TABLE IF NOT EXISTS public.email_unsubscribes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  unsubscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.email_unsubscribes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public unsubscribe insert" ON public.email_unsubscribes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin unsubscribe select" ON public.email_unsubscribes FOR SELECT USING (public.is_admin());
