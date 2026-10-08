'use client';

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'rectangle' | 'leaderboard';
  className?: string;
}

export default function AdBanner({
  slot = 'placeholder',
  format = 'horizontal',
  className = '',
}: AdBannerProps) {
  // To activate real Google AdSense ads:
  // 1. Add your AdSense client ID (e.g. ca-pub-XXXXXXXXXXXXXXXX) in layout.tsx
  // 2. Pass your actual slot ID to this component
  // 3. Set process.env.NEXT_PUBLIC_ADS_ENABLED = 'true'
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

  if (adsEnabled) {
    return (
      <div className={`my-8 text-center overflow-hidden ${className}`}>
        <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
          Advertisement
        </div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-placeholder'}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Polished placeholder banner shown in preview/development
  return (
    <aside
      aria-label="Advertisement Banner"
      className={`my-8 max-w-4xl mx-auto px-4 ${className}`}
    >
      <div className="glass-card rounded-xl p-4 border border-dashed border-white/20 text-center relative overflow-hidden bg-gradient-to-r from-primary-950/20 via-black/40 to-accent-950/20">
        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-2 px-2">
          <span>SPONSORED / AD SPACE</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
            Google AdSense · Ready
          </span>
        </div>
        
        <div className="py-3 flex flex-col items-center justify-center">
          <p className="text-xs md:text-sm text-gray-300 font-medium">
            ✨ Monetization Slot: High-CTR Responsive Display Ad
          </p>
          <p className="text-[11px] text-gray-500 mt-1 max-w-md">
            Place your Google AdSense code or Mediavine ad tag here to monetize daily visitors and search traffic.
          </p>
        </div>
      </div>
    </aside>
  );
}
