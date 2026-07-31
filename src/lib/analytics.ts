'use client';

export const TRACKING_EVENTS = {
  CONSULTATION_SUBMIT: 'consultation_submit',
  WHATSAPP_CLICK: 'whatsapp_click',
  ROI_CALCULATOR_USE: 'roi_calculator_use',
  PROPERTY_VIEW: 'property_view',
  DEVELOPMENT_VIEW: 'development_view',
  AI_CONCIERGE_INTERACTION: 'ai_concierge_interaction',
  SEARCH_USAGE: 'search_usage',
  FILTER_USAGE: 'filter_usage',
  COMPARISON_USAGE: 'comparison_usage',
  BROCHURE_DOWNLOAD: 'brochure_download',
  VIEWING_BOOKING: 'viewing_booking',
  PROPERTY_INQUIRY: 'property_inquiry',
} as const;

export type TrackingEventName = typeof TRACKING_EVENTS[keyof typeof TRACKING_EVENTS];

/**
 * Dynamically inject GA4, GTM, and Meta Pixel scripts once cookie consent is approved.
 */
export function initializeAnalytics(config: { gaId?: string; gtmId?: string; pixelId?: string }) {
  if (typeof window === 'undefined') return;

  // Google Analytics 4
  if (config.gaId && !document.getElementById('ga4-script')) {
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaId}`;
    script.async = true;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', config.gaId);
  }

  // Google Tag Manager
  if (config.gtmId && !document.getElementById('gtm-script')) {
    const script = document.createElement('script');
    script.id = 'gtm-script';
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${config.gtmId}');`;
    document.head.appendChild(script);
  }

  // Meta Pixel
  if (config.pixelId && !document.getElementById('meta-pixel-script')) {
    const script = document.createElement('script');
    script.id = 'meta-pixel-script';
    script.innerHTML = `!function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${config.pixelId}');
    fbq('track', 'PageView');`;
    document.head.appendChild(script);
  }
}

/**
 * Dispatch named custom tracking events to GA4, GTM, and Meta Pixel.
 */
export function trackEvent(eventName: TrackingEventName, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  // Dispatch to GA4
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', eventName, params);
  }

  // Dispatch to GTM dataLayer
  if (Array.isArray((window as any).dataLayer)) {
    (window as any).dataLayer.push({
      event: eventName,
      ...params,
    });
  }

  // Dispatch to Meta Pixel
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('trackCustom', eventName, params);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Event] ${eventName}:`, params);
  }
}
