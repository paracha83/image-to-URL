import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

export const ADSTERRA_CONFIG = {
  popunder: {
    name: 'Popunder_1',
    id: '31861585',
    scriptSrc: 'https://afders.org/1/c3184412937957723b0417aa97fcfc28',
  },
  nativeBanner: {
    name: 'NativeBanner_1',
    id: '31861586',
    scriptSrc: 'https://bicea.org/21/1b70d30dde32bdc41b063df89a86279f',
    containerId: 'container-1b70d30dde32bdc41b063df89a86279f',
  },
  smartlink: {
    name: 'Smartlink_1',
    id: '31861587',
    url: 'https://arwf.org/4/c5d88eb3269ec23228f71a12c390c3a1',
  },
  socialBar: {
    name: 'SocialBar_1',
    id: '31861588',
    scriptSrc: 'https://bicea.org/14/487d6c178aca7282c6998603e3a945f6',
  },
  banner468x60: {
    name: '468x60_1',
    id: '31861589',
    key: 'd623dd3afe0bd75685dba4d1b85d425b',
    width: 468,
    height: 60,
  },
  banner300x250: {
    name: '300x250_1',
    id: '31861590',
    key: 'bc8be38d5923be3f2d10d0118cc9f546',
    width: 300,
    height: 250,
  },
  banner160x300: {
    name: '160x300_1',
    id: '31861591',
    key: 'd210e26f803c3c7a87ae66a549b0cd56',
    width: 160,
    height: 300,
  },
  banner160x600: {
    name: '160x600_1',
    id: '31861592',
    key: '2d4825b6b01497fc29764ff8ac4ad059',
    width: 160,
    height: 600,
  },
  banner320x50: {
    name: '320x50_1',
    id: '31861593',
    key: '8b5489950bff6d213e196c1d3c72059f',
    width: 320,
    height: 50,
  },
  banner728x90: {
    name: '728x90_1',
    id: '31861594',
    key: '375d10654db401c2a9c90c1f17ba8d76',
    width: 728,
    height: 90,
  },
} as const;

export type BannerFormat = '728x90' | '468x60' | '300x250' | '160x600' | '160x300' | '320x50';

const BANNER_MAP: Record<BannerFormat, { key: string; width: number; height: number; id: string }> = {
  '728x90': ADSTERRA_CONFIG.banner728x90,
  '468x60': ADSTERRA_CONFIG.banner468x60,
  '300x250': ADSTERRA_CONFIG.banner300x250,
  '160x600': ADSTERRA_CONFIG.banner160x600,
  '160x300': ADSTERRA_CONFIG.banner160x300,
  '320x50': ADSTERRA_CONFIG.banner320x50,
};

// =========================================================================
// 1. ISOLATED ADSTERRA BANNER COMPONENT (Supports all 6 standard banner sizes)
// =========================================================================
interface AdsterraBannerProps {
  format: BannerFormat;
  className?: string;
  showSponsoredBadge?: boolean;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({
  format,
  className = '',
  showSponsoredBadge = true,
}) => {
  const config = BANNER_MAP[format];
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // HTML content injected into the isolated iframe document
  const srcDoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body {
            width: 100%;
            height: 100%;
            background: transparent;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${config.key}',
            'format' : 'iframe',
            'height' : ${config.height},
            'width' : ${config.width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://bicea.org/22/${config.key}"></script>
      </body>
    </html>
  `;

  return (
    <div
      className={`flex flex-col items-center justify-center my-3 overflow-hidden ${className}`}
      data-adsterra-unit={config.id}
    >
      {showSponsoredBadge && (
        <div
          style={{ width: `${config.width}px`, maxWidth: '100%' }}
          className="flex items-center justify-between px-1 mb-1 text-[10px] text-zinc-500 uppercase font-mono tracking-wider"
        >
          <span>Advertisement</span>
          <span>Sponsored</span>
        </div>
      )}
      <div
        style={{
          width: `${config.width}px`,
          height: `${config.height}px`,
          maxWidth: '100%',
        }}
        className="rounded-lg overflow-hidden bg-zinc-900/40 border border-zinc-800/50 shadow-sm flex items-center justify-center transition-all"
      >
        <iframe
          ref={iframeRef}
          srcDoc={srcDoc}
          title={`Adsterra Ad ${format}`}
          width={config.width}
          height={config.height}
          scrolling="no"
          frameBorder="0"
          className="w-full h-full border-0 block"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        />
      </div>
    </div>
  );
};

// =========================================================================
// 2. DYNAMIC RESPONSIVE BANNER (728x90 Desktop -> 468x60 Tablet -> 320x50 Mobile)
// =========================================================================
interface ResponsiveBannerProps {
  className?: string;
  showSponsoredBadge?: boolean;
}

export const AdsterraResponsiveBanner: React.FC<ResponsiveBannerProps> = ({
  className = '',
  showSponsoredBadge = true,
}) => {
  const [format, setFormat] = useState<BannerFormat>('728x90');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setFormat('728x90');
      } else if (width >= 500) {
        setFormat('468x60');
      } else {
        setFormat('320x50');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AdsterraBanner
      format={format}
      className={className}
      showSponsoredBadge={showSponsoredBadge}
    />
  );
};

// =========================================================================
// 3. ADSTERRA NATIVE BANNER (Unit ID: 31861586)
// =========================================================================
interface NativeBannerProps {
  className?: string;
  title?: string;
}

export const AdsterraNativeBanner: React.FC<NativeBannerProps> = ({
  className = '',
  title = 'Recommended by Sponsors',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Avoid double injection
    if (!containerRef.current) return;
    const existingScript = containerRef.current.querySelector(
      `script[src="${ADSTERRA_CONFIG.nativeBanner.scriptSrc}"]`
    );
    if (existingScript) return;

    try {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = ADSTERRA_CONFIG.nativeBanner.scriptSrc;
      containerRef.current.appendChild(script);
    } catch {
      // Ignore injection error
    }
  }, []);

  return (
    <div
      className={`w-full max-w-4xl mx-auto my-6 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 shadow-lg ${className}`}
      data-adsterra-unit={ADSTERRA_CONFIG.nativeBanner.id}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            {title}
          </span>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
          Sponsored
        </span>
      </div>

      <div ref={containerRef} className="w-full min-h-[120px] flex items-center justify-center">
        <div id={ADSTERRA_CONFIG.nativeBanner.containerId} className="w-full text-center" />
      </div>
    </div>
  );
};

// =========================================================================
// 4. SMARTLINK PROMOTIONAL CARD & BUTTON (Unit ID: 31861587)
// =========================================================================
interface SmartlinkProps {
  variant?: 'banner' | 'button' | 'compact';
  className?: string;
  label?: string;
}

export const AdsterraSmartlink: React.FC<SmartlinkProps> = ({
  variant = 'banner',
  className = '',
  label,
}) => {
  const url = ADSTERRA_CONFIG.smartlink.url;

  if (variant === 'button') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors shadow-sm ${className}`}
        data-adsterra-unit={ADSTERRA_CONFIG.smartlink.id}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>{label || 'Special Partner Offer'}</span>
        <ExternalLink className="w-3 h-3 text-amber-400/80" />
      </a>
    );
  }

  if (variant === 'compact') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`flex items-center justify-between px-3 py-2 rounded-xl bg-purple-950/20 hover:bg-purple-900/30 border border-purple-800/40 text-purple-200 text-xs transition-colors ${className}`}
        data-adsterra-unit={ADSTERRA_CONFIG.smartlink.id}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">{label || 'Sponsored: Fast Cloud CDN & Storage Partner'}</span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-purple-400 shrink-0 ml-2" />
      </a>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/20 via-zinc-900/40 to-indigo-900/20 border border-purple-500/30 p-4 sm:p-5 my-4 transition-all hover:border-purple-500/50 ${className}`}
      data-adsterra-unit={ADSTERRA_CONFIG.smartlink.id}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Sponsored Recommendation
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Adsterra Smartlink</span>
          </div>
          <h4 className="text-sm font-semibold text-white">
            {label || 'Looking for High-Speed Global CDN Storage & Media Hosting?'}
          </h4>
          <p className="text-xs text-zinc-400">
            Discover verified partner offers for unmetered high-bandwidth image distribution and cloud compute.
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-md shadow-purple-900/30 shrink-0"
        >
          <span>Explore Partner Offer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
