import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations('Footer');
  const b = useTranslations('Brand');

  return (
    <footer className="bg-neoma-black border-t border-neoma-gold/20 pt-20 pb-12 px-6 relative overflow-hidden">
      {/* Background Gold Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-neoma-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
        {/* Brand Overview */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-neoma-gold/40 flex items-center justify-center bg-neoma-dark">
              <span className="text-neoma-gold font-playfair font-bold text-xl">N</span>
            </div>
            <div>
              <span className="block font-playfair font-bold tracking-widest text-xl text-neoma-ivory">
                {b('name')}
              </span>
              <span className="block text-xs tracking-widest uppercase text-neoma-gold">
                Saudi Arabia
              </span>
            </div>
          </div>
          <p className="text-neoma-gray-300 text-sm leading-relaxed max-w-md">
            {b('tagline')}. We design and build world-class architectural landmarks across Riyadh, Diriyah, and the Red Sea coast in alignment with Saudi Vision 2030.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="px-3 py-1 rounded-full border border-neoma-gold/30 text-[11px] text-neoma-gold uppercase tracking-wider font-mono">
              Saudi Vision 2030 Aligned
            </span>
            <span className="px-3 py-1 rounded-full border border-neoma-emerald/40 text-[11px] text-neoma-emerald uppercase tracking-wider font-mono">
              ISO 14001 Sustainable
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-playfair text-neoma-ivory text-base font-semibold mb-6 tracking-wide">
            Sanctuaries
          </h4>
          <ul className="space-y-3 text-sm text-neoma-gray-300">
            <li>
              <Link href={`/${locale}#developments`} className="hover:text-neoma-gold transition-colors">
                The Obsidian Tower
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#developments`} className="hover:text-neoma-gold transition-colors">
                Diriyah Royal Estates
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#developments`} className="hover:text-neoma-gold transition-colors">
                Red Sea Horizon Villas
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#properties`} className="hover:text-neoma-gold transition-colors">
                Sky Penthouses
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Advisory */}
        <div>
          <h4 className="font-playfair text-neoma-ivory text-base font-semibold mb-6 tracking-wide">
            Advisory & Legal
          </h4>
          <ul className="space-y-3 text-sm text-neoma-gray-300">
            <li>
              <Link href={`/${locale}/privacy-policy`} className="hover:text-neoma-gold transition-colors">
                {t('privacy')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/terms-and-conditions`} className="hover:text-neoma-gold transition-colors">
                {t('terms')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#consultation`} className="hover:text-neoma-gold transition-colors">
                Private Advisory
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/admin`} className="hover:text-neoma-gold transition-colors">
                Internal Portal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-neoma-gold/10 flex flex-col md:flex-row items-center justify-between text-xs text-neoma-gray-500 gap-4">
        <p>© {new Date().getFullYear()} {t('rights')}</p>
        <p className="font-mono text-[11px]">Riyadh • Jeddah • NEOM Region • London • Dubai</p>
      </div>
    </footer>
  );
}
