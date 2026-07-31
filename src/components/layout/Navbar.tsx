'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Bookmark, Globe, MessageSquare, Menu, X, Shield } from 'lucide-react';
import FavoritesDrawer from '../home/FavoritesDrawer';

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync favorites count from localStorage
  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('neoma_favorites') || '[]');
        setFavoritesCount(saved.length);
      } catch (e) {
        setFavoritesCount(0);
      }
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    const interval = setInterval(updateCount, 1500);
    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    // Replace current locale prefix
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(newPath || `/${nextLocale}`);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'glass-panel py-3 shadow-gold-glow'
            : 'bg-gradient-to-b from-neoma-black/90 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href={`/${locale}`} className="group flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-neoma-gold/40 flex items-center justify-center bg-neoma-dark group-hover:border-neoma-gold transition-colors">
              <span className="text-neoma-gold font-playfair font-bold text-xl">N</span>
            </div>
            <div>
              <span className="block font-playfair font-bold tracking-widest text-lg text-neoma-ivory group-hover:text-neoma-gold transition-colors">
                NEOMA
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-neoma-gold/80">
                Residences
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm tracking-wide text-neoma-gray-300">
            <Link href={`/${locale}#developments`} className="hover:text-neoma-gold transition-colors">
              {t('developments')}
            </Link>
            <Link href={`/${locale}#properties`} className="hover:text-neoma-gold transition-colors">
              {t('properties')}
            </Link>
            <Link href={`/${locale}#lifestyle`} className="hover:text-neoma-gold transition-colors">
              {t('lifestyle')}
            </Link>
            <Link href={`/${locale}#investment`} className="hover:text-neoma-gold transition-colors">
              {t('investment')}
            </Link>
            <Link href={`/${locale}#vision`} className="hover:text-neoma-gold transition-colors">
              {t('vision')}
            </Link>
            <Link href={`/${locale}/admin`} className="hover:text-neoma-gold transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-neoma-gold" />
              {t('admin')}
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neoma-gold/20 hover:border-neoma-gold text-xs text-neoma-ivory hover:text-neoma-gold transition-all"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-neoma-gold" />
              <span className="font-semibold uppercase">{locale === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Favorites Drawer Toggle */}
            <button
              onClick={() => setFavoritesOpen(true)}
              className="relative p-2 rounded-full border border-neoma-gold/20 hover:border-neoma-gold text-neoma-ivory hover:text-neoma-gold transition-all"
              title="Saved Residences"
            >
              <Bookmark className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neoma-gold text-neoma-black font-bold text-[10px] flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Private Tour CTA */}
            <Link
              href={`/${locale}#consultation`}
              className="px-5 py-2.5 rounded-full bg-gold-gradient text-neoma-black font-medium text-xs tracking-wider uppercase hover:opacity-90 transition-all shadow-gold-glow"
            >
              {t('scheduleTour')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neoma-ivory hover:text-neoma-gold"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-panel border-t border-neoma-gold/20 px-6 py-6 space-y-4">
            <nav className="flex flex-col gap-4 text-sm text-neoma-ivory">
              <Link
                href={`/${locale}#developments`}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-neoma-gold"
              >
                {t('developments')}
              </Link>
              <Link
                href={`/${locale}#properties`}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-neoma-gold"
              >
                {t('properties')}
              </Link>
              <Link
                href={`/${locale}#lifestyle`}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-neoma-gold"
              >
                {t('lifestyle')}
              </Link>
              <Link
                href={`/${locale}#investment`}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-neoma-gold"
              >
                {t('investment')}
              </Link>
              <Link
                href={`/${locale}/admin`}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-neoma-gold flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-neoma-gold" />
                {t('admin')}
              </Link>
            </nav>
            <div className="pt-4 border-t border-neoma-gold/10 flex items-center justify-between">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-xs text-neoma-gold font-bold uppercase"
              >
                <Globe className="w-4 h-4" />
                {locale === 'en' ? 'العربية' : 'English'}
              </button>
              <Link
                href={`/${locale}#consultation`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-full bg-neoma-gold text-neoma-black text-xs font-semibold"
              >
                {t('scheduleTour')}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Favorites Sidebar Drawer */}
      <FavoritesDrawer locale={locale} isOpen={favoritesOpen} onClose={() => setFavoritesOpen(false)} />
    </>
  );
}
