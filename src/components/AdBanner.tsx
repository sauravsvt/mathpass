'use client';

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'rectangle' | 'leaderboard';
  className?: string;
}

export default function AdBanner({
  slot = 'default',
  className = '',
}: AdBannerProps) {
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

  // Only render when ads are explicitly enabled via environment variables
  if (!adsEnabled) {
    return null;
  }

  return (
    <div className={`my-8 text-center overflow-hidden ${className}`}>
      <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
        Advertisement
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID || ''}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
