import { createClient } from '@/lib/supabase/client';

export interface UserSessionData {
  sessionId: string;
  country?: string;
  language?: string;
  deviceType?: string;
  viewedProperties?: string[];
  viewedDevelopments?: string[];
  consentGiven: boolean;
}

export const DEFAULT_PERSONALIZATION = {
  heroHeadline: 'Crafting Iconic Spaces for Extraordinary Lives',
  recommendedCategory: 'Ultra-Luxury Tower',
  ctaText: 'Explore Private Portfolio',
  isPersonalized: false,
};

/**
 * Log property view into user_sessions ONLY if consent_given = true.
 */
export async function logUserSessionView(session: UserSessionData, propertySlug: string) {
  // Consent-Gate Check: Do not write session data unless consent is explicit
  if (!session.consentGiven) return;

  try {
    const supabase = createClient();
    const existingProps = session.viewedProperties || [];
    const updatedProps = Array.from(new Set([...existingProps, propertySlug]));

    await supabase.from('user_sessions').upsert([
      {
        session_id: session.sessionId,
        country: session.country || 'Saudi Arabia',
        language: session.language || 'en',
        device_type: session.deviceType || 'desktop',
        viewed_properties: updatedProps,
        consent_given: true,
      },
    ]);
  } catch (err) {
    console.warn('User session log warning:', err);
  }
}

/**
 * Derive personalized recommendations ONLY when consent is granted.
 */
export function getPersonalizedContent(session?: UserSessionData) {
  if (!session || !session.consentGiven || !session.viewedProperties || session.viewedProperties.length === 0) {
    return DEFAULT_PERSONALIZATION;
  }

  // Personalized State
  const lastViewed = session.viewedProperties[session.viewedProperties.length - 1];
  let category = 'Ultra-Luxury Tower';
  if (lastViewed.includes('diriyah') || lastViewed.includes('villa') || lastViewed.includes('estate')) {
    category = 'Heritage Villa Estate';
  } else if (lastViewed.includes('red-sea') || lastViewed.includes('sanctuary')) {
    category = 'Waterfront Sanctuaries';
  }

  return {
    heroHeadline: `Welcome Back to Your ${category} Selection`,
    recommendedCategory: category,
    ctaText: 'Continue Exploring Selected Tier',
    isPersonalized: true,
  };
}
