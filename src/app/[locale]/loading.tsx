export default function Loading() {
  return (
    <div className="min-h-screen bg-neoma-black flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header Shimmer */}
        <div className="h-16 skeleton-shimmer rounded-xl w-3/4 mx-auto border border-neoma-gold/10"></div>
        {/* Subtitle Shimmer */}
        <div className="h-6 skeleton-shimmer rounded-lg w-1/2 mx-auto"></div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="h-96 skeleton-shimmer rounded-2xl border border-neoma-gold/10"></div>
          <div className="h-96 skeleton-shimmer rounded-2xl border border-neoma-gold/10"></div>
          <div className="h-96 skeleton-shimmer rounded-2xl border border-neoma-gold/10"></div>
        </div>
      </div>
    </div>
  );
}
