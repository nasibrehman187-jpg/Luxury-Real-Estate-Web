import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neoma-black flex flex-col justify-center items-center px-6 text-center">
      <div className="glass-panel p-12 rounded-3xl max-w-xl border border-neoma-gold/30 shadow-gold-glow">
        <h1 className="text-7xl font-playfair font-bold text-gold-gradient mb-4">404</h1>
        <h2 className="text-2xl font-playfair font-semibold text-neoma-ivory mb-4">
          Residence Not Found
        </h2>
        <p className="text-neoma-gray-300 text-sm mb-8">
          The requested sanctuary or masterplan location could not be located in our private register.
        </p>
        <Link
          href="/en"
          className="inline-block px-8 py-4 rounded-full bg-gold-gradient text-neoma-black font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-gold-glow"
        >
          Return to Residences
        </Link>
      </div>
    </div>
  );
}
