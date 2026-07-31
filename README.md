# NEOMA Residences — Enterprise Luxury Real Estate Platform (Phases 1, 2, & 3)

**Brand Vision:** *"Crafting Iconic Spaces for Extraordinary Lives."*  
A world-class luxury real estate ecosystem engineered for Saudi Arabia (KAFD Riyadh, Historic Diriyah, Red Sea Coast), rivaling NEOM, EMAAR, Diriyah Company, DAMAC, Bentley Residences, and Rolex.

---

## Technical Stack

* **Framework:** Next.js 15 (App Router, Server Actions, Dynamic Metadata, i18n Subroutes)
* **Language & Typing:** TypeScript & Zod Schema Validation (`src/env.ts`)
* **Styling & Fonts:** Tailwind CSS (Custom Theme Tokens: Deep Black `#0B0B0B`, Gold `#D4AF37`, Ivory `#F5F5F0`, Emerald `#0F8A6C`), Google Fonts (`Playfair Display`, `Inter`, `Amiri`, `Tajawal`)
* **Localization:** `next-intl` (Route-based `/en` & `/ar` with Arabic-Indic formatting via `formatCurrency()`)
* **3D & 360° Media:** Three.js, React Three Fiber, `@react-three/drei`, `pannellum` (360° Virtual Property Tours), `@react-pdf/renderer` (Server-side PDF Exports)
* **AI Ecosystem:** Anthropic Claude API (`@anthropic-ai/sdk`) with Tool-Use Grounding (`get_property_price`, `get_development_details`, `check_availability`) & strict hallucination prevention
* **Database, Auth & Storage:** Supabase PostgreSQL, Row Level Security (RLS), Storage Buckets (`developments-media`, `properties-media`, `testimonials`, `brochures`, `floorplans`, `developments-3d`, `virtual-tours`)
* **CRM Layer:** Pluggable CRM Abstraction (`CrmProvider`) with HubSpot reference adapter (`HubSpotCRMAdapter`) & 3x exponential backoff
* **Marketing Automation:** Resend transactional email SDK (`RESEND_API_KEY`) & React Email templates
* **Rate Limiting & Security:** `@upstash/ratelimit` sliding window on all lead & AI endpoints
* **Observability:** Sentry Error Monitoring & Vercel Analytics

---

## Environment Configuration

Copy `.env.example` to `.env.local` and configure your credentials:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Database, Auth, Storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Provider Keys
OPENAI_API_KEY=sk-proj-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# CRM Integration (HubSpot Reference Adapter)
HUBSPOT_API_KEY=pat-na1-your-hubspot-api-key

# Transactional Email (Resend)
RESEND_API_KEY=re_your_resend_api_key

# WhatsApp Direct Connect
NEXT_PUBLIC_WHATSAPP_NUMBER=+966500000000
```

---

## Local Development & Production Build

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run local development server
npm run dev

# Production build compilation check
npm run build

# Start production server
npm run start
```

---

## Database RLS Security & Admin Bootstrap

1. Run `supabase/schema.sql` to initialize DDL tables, ENUM types (`super_admin`, `content_manager`, `agent`), storage buckets, and RLS policies.
2. Run `supabase/seed.sql` to populate sample developments, properties, landmarks, 3D media, and agent users.

### First Super Admin Bootstrap Script
Run this query in Supabase SQL Editor after signing up a user in Supabase Auth:

```sql
INSERT INTO public.admin_users (user_id, role)
VALUES ('YOUR_SUPABASE_AUTH_USER_UUID_HERE', 'super_admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
```

---

## Verification & Architecture Matrix

* **Interactive 3D Building Explorer (`/explore`)**: Features WebGL capability detection. Falls back to static high-resolution visual gallery (`WebGLFallbackGallery.tsx`) on unsupported devices.
* **360° Virtual Property Tours (`VirtualTourViewer.tsx`)**: Built using `pannellum` with room-to-room navigation hotspots.
* **Claude AI Concierge 2.0**: Tool-use grounded (`get_property_price`, `get_development_details`, `check_availability`). Returns *"I don't currently have verified information for that request"* if database query returns no match.
* **CRM Integration Adapter**: Pluggable interface with 3x retry exponential backoff syncing contacts and deals to HubSpot.
* **Session-Scoped Preloader**: Displays Monogram -> Gold Line -> Brand Promise reveal sequence once per session (`sessionStorage`), skippable after 1 second.
