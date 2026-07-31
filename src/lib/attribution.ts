/**
 * Extract lead attribution parameters (UTM tags, referrer, device type).
 */
export function extractAttribution(searchParams?: URLSearchParams | Record<string, string>) {
  if (typeof window === 'undefined') {
    return {
      utm_source: 'direct',
      utm_medium: 'none',
      utm_campaign: 'none',
      referrer: 'direct',
      device_type: 'desktop',
    };
  }

  const urlParams = searchParams
    ? new URLSearchParams(searchParams as any)
    : new URLSearchParams(window.location.search);

  const ua = navigator.userAgent || '';
  let deviceType = 'desktop';
  if (/mobile/i.test(ua)) deviceType = 'mobile';
  else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';

  return {
    utm_source: urlParams.get('utm_source') || 'direct',
    utm_medium: urlParams.get('utm_medium') || 'none',
    utm_campaign: urlParams.get('utm_campaign') || 'none',
    referrer: document.referrer || 'direct',
    device_type: deviceType,
  };
}

/**
 * Server-side helper to parse device type from User-Agent header.
 */
export function parseDeviceTypeFromUA(useragent: string | null): string {
  if (!useragent) return 'desktop';
  if (/mobile/i.test(useragent)) return 'mobile';
  if (/tablet|ipad/i.test(useragent)) return 'tablet';
  return 'desktop';
}
