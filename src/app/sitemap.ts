import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://neoma-residences.com';
  const locales = ['en', 'ar'];

  const staticRoutes = ['', '/properties', '/investment', '/privacy-policy', '/terms-and-conditions'];
  const propertiesSlugs = ['the-sky-penthouse-obsidian', 'royal-diriyah-palace-estate', 'coral-sanctuary-overwater-villa'];
  const developmentsSlugs = ['the-obsidian-tower-riyadh', 'diriyah-royal-estates', 'red-sea-horizon-villas'];

  const entries: MetadataRoute.Sitemap = [];

  // Static Indexable Pages
  staticRoutes.forEach((route) => {
    locales.forEach((locale) => {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1.0 : 0.8,
      });
    });
  });

  // Dynamic Property Routes
  propertiesSlugs.forEach((slug) => {
    locales.forEach((locale) => {
      entries.push({
        url: `${baseUrl}/${locale}/properties/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });
  });

  // Dynamic Development Routes
  developmentsSlugs.forEach((slug) => {
    locales.forEach((locale) => {
      entries.push({
        url: `${baseUrl}/${locale}/developments/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });
  });

  return entries;
}
