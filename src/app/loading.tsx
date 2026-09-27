export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream pt-chrome">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo mark */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-ping rounded-full bg-gold/20" />
          <div className="absolute inset-2 animate-pulse rounded-full bg-gold/30" />
          <div className="absolute inset-4 flex items-center justify-center rounded-full bg-navy-deep">
            <span className="font-display text-sm font-bold text-gold">N</span>
          </div>
        </div>
        <p className="text-sm text-charcoal/60">Loading...</p>
      </div>
    </div>
  );
}
