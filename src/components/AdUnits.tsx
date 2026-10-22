import React, { useEffect, useRef, useState, useId } from 'react';
import { ExternalLink, Sparkles, Megaphone } from 'lucide-react';

/**
 * ==============================================================================
 * ADSTERRA 10 AD UNITS MASTER CONFIGURATION
 * ==============================================================================
 */
export const ADSTERRA_UNITS = {
  // 1. Popunder
  popunder: {
    name: 'Popunder_1',
    id: '31861585',
    scriptSrc: 'https://afders.org/1/c3184412937957723b0417aa97fcfc28',
  },
  // 2. Native Banner
  nativeBanner: {
    name: 'NativeBanner_1',
    id: '31861586',
    scriptSrc: 'https://bicea.org/21/1b70d30dde32bdc41b063df89a86279f',
    containerId: 'container-1b70d30dde32bdc41b063df89a86279f',
  },
  // 3. Smartlink
  smartlink: {
    name: 'Smartlink_1',
    id: '31861587',
    url: 'https://arwf.org/4/c5d88eb3269ec23228f71a12c390c3a1',
  },
  // 4. Social Bar
  socialBar: {
    name: 'SocialBar_1',
    id: '31861588',
    scriptSrc: 'https://bicea.org/14/487d6c178aca7282c6998603e3a945f6',
  },
  // 5. Banner 468x60
  banner468x60: {
    name: '468x60_1',
    id: '31861589',
    key: 'd623dd3afe0bd75685dba4d1b85d425b',
    width: 468,
    height: 60,
  },
  // 6. Banner 300x250
  banner300x250: {
    name: '300x250_1',
    id: '31861590',
    key: 'bc8be38d5923be3f2d10d0118cc9f546',
    width: 300,
    height: 250,
  },
  // 7. Banner 160x300
  banner160x300: {
    name: '160x300_1',
    id: '31861591',
    key: 'd210e26f803c3c7a87ae66a549b0cd56',
    width: 160,
    height: 300,
  },
  // 8. Banner 160x600
  banner160x600: {
    name: '160x600_1',
    id: '31861592',
    key: '2d4825b6b01497fc29764ff8ac4ad059',
    width: 160,
    height: 600,
  },
  // 9. Banner 320x50
  banner320x50: {
    name: '320x50_1',
    id: '31861593',
    key: '8b5489950bff6d213e196c1d3c72059f',
    width: 320,
    height: 50,
  },
  // 10. Banner 728x90
  banner728x90: {
    name: '728x90_1',
    id: '31861594',
    key: '375d10654db401c2a9c90c1f17ba8d76',
    width: 728,
    height: 90,
  },
} as const;

export type BannerSize = '728x90' | '468x60' | '300x250' | '160x600' | '160x300' | '320x50';

const SIZE_CONFIG_MAP: Record<BannerSize, { key: string; width: number; height: number; id: string }> = {
  '728x90': ADSTERRA_UNITS.banner728x90,
  '468x60': ADSTERRA_UNITS.banner468x60,
  '300x250': ADSTERRA_UNITS.banner300x250,
  '160x600': ADSTERRA_UNITS.banner160x600,
  '160x300': ADSTERRA_UNITS.banner160x300,
  '320x50': ADSTERRA_UNITS.banner320x50,
};

/**
 * ==============================================================================
 * DYNAMIC SCRIPT INJECTION HOOKS
 * ==============================================================================
 */

/**
 * Hook to dynamically inject Popunder ad script into document.body
 * Unit ID: 31861585
 */
export function useAdsterraPopunder(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    const SCRIPT_ID = 'adsterra-popunder-script';
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'text/javascript';
      script.setAttribute('data-cfasync', 'false');
      script.src = ADSTERRA_UNITS.popunder.scriptSrc;
      document.body.appendChild(script);
    }

    return () => {
      // Popunder script stays active once loaded
    };
  }, [enabled]);
}

/**
 * Hook to dynamically inject Social Bar ad script into document.body
 * Unit ID: 31861588
 */
export function useAdsterraSocialBar(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    const SCRIPT_ID = 'adsterra-socialbar-script';
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'text/javascript';
      script.setAttribute('data-cfasync', 'false');
      script.src = ADSTERRA_UNITS.socialBar.scriptSrc;
      document.body.appendChild(script);
    }
  }, [enabled]);
}

/**
 * Global monetization hook that safely manages Popunder & Social Bar scripts
 */
export function useAdsterraGlobalAds(options?: { popunder?: boolean; socialBar?: boolean }) {
  const popunder = options?.popunder ?? true;
  const socialBar = options?.socialBar ?? true;

  useAdsterraPopunder(popunder);
  useAdsterraSocialBar(socialBar);
}

/**
 * ==============================================================================
 * CONFIGURABLE AD COMPONENTS
 * ==============================================================================
 */

/**
 * 1. Popunder Component (wrapper for useAdsterraPopunder hook)
 */
export const PopunderAdUnit: React.FC<{ enabled?: boolean }> = ({ enabled = true }) => {
  useAdsterraPopunder(enabled);
  return null;
};

/**
 * 2. Social Bar Component (wrapper for useAdsterraSocialBar hook)
 */
export const SocialBarAdUnit: React.FC<{ enabled?: boolean }> = ({ enabled = true }) => {
  useAdsterraSocialBar(enabled);
  return null;
};

/**
 * 3. Configurable Banner Ad Unit (Banners 728x90, 468x60, 300x250, 160x600, 160x300, 320x50)
 * Uses an isolated sandbox iframe to execute atOptions and external script safely without React reconciliation conflicts.
 */
export interface BannerAdUnitProps {
  format: BannerSize;
  className?: string;
  showBadge?: boolean;
}

export const BannerAdUnit: React.FC<BannerAdUnitProps> = ({
  format,
  className = '',
  showBadge = true,
}) => {
  const config = SIZE_CONFIG_MAP[format];
  const uniqueId = useId();

  // Create isolated sandboxed document for script execution
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
      className={`flex flex-col items-center justify-center my-2 max-w-full overflow-hidden ${className}`}
      data-adsterra-unit={config.id}
      id={`adsterra-banner-${uniqueId}`}
    >
      {showBadge && (
        <div
          style={{ width: `${config.width}px`, maxWidth: '100%' }}
          className="flex items-center justify-between px-1 mb-1 text-[10px] text-zinc-500 uppercase font-mono tracking-wider"
        >
          <span className="flex items-center gap-1">
            <Megaphone className="w-2.5 h-2.5 text-zinc-500" />
            <span>Advertisement</span>
          </span>
          <span>Sponsored</span>
        </div>
      )}

      <div
        style={{
          width: `${config.width}px`,
          height: `${config.height}px`,
          maxWidth: '100%',
        }}
        className="rounded-lg overflow-hidden bg-zinc-900/40 border border-zinc-800/60 shadow-sm flex items-center justify-center transition-all"
      >
        <iframe
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

/**
 * 4. Configurable Native Banner Ad Unit (Unit ID: 31861586)
 * Injects container and script dynamically
 */
export interface NativeBannerUnitProps {
  title?: string;
  className?: string;
}

export const NativeBannerUnit: React.FC<NativeBannerUnitProps> = ({
  title = 'Sponsored Recommendations',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if script already appended in container
    const existing = containerRef.current.querySelector('script');
    if (existing) return;

    try {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = ADSTERRA_UNITS.nativeBanner.scriptSrc;
      containerRef.current.appendChild(script);
    } catch (e) {
      console.warn('Native banner script injection error', e);
    }
  }, []);

  return (
    <div
      className={`w-full max-w-4xl mx-auto my-6 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 shadow-md ${className}`}
      data-adsterra-unit={ADSTERRA_UNITS.nativeBanner.id}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/70">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            {title}
          </span>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/40">
          Sponsored
        </span>
      </div>

      <div ref={containerRef} className="w-full min-h-[100px] flex items-center justify-center">
        <div id={ADSTERRA_UNITS.nativeBanner.containerId} className="w-full text-center" />
      </div>
    </div>
  );
};

/**
 * 5. Configurable Smartlink Ad Unit (Unit ID: 31861587)
 * Multiple high-converting design variants: banner, button, compact
 */
export interface SmartlinkUnitProps {
  variant?: 'banner' | 'button' | 'compact';
  label?: string;
  sublabel?: string;
  className?: string;
}

export const SmartlinkUnit: React.FC<SmartlinkUnitProps> = ({
  variant = 'banner',
  label,
  sublabel,
  className = '',
}) => {
  const url = ADSTERRA_UNITS.smartlink.url;

  if (variant === 'button') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all shadow-sm ${className}`}
        data-adsterra-unit={ADSTERRA_UNITS.smartlink.id}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>{label || 'Special Partner Deal'}</span>
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
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-purple-950/20 hover:bg-purple-900/30 border border-purple-800/40 text-purple-200 text-xs transition-colors ${className}`}
        data-adsterra-unit={ADSTERRA_UNITS.smartlink.id}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">{label || 'Sponsored: Fast Cloud CDN & Image Hosting'}</span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-purple-400 shrink-0 ml-2" />
      </a>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/30 via-zinc-900/60 to-indigo-950/30 border border-purple-500/30 p-4 sm:p-5 my-4 transition-all hover:border-purple-500/50 shadow-lg ${className}`}
      data-adsterra-unit={ADSTERRA_UNITS.smartlink.id}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Sponsored Offer
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Adsterra Smartlink</span>
          </div>
          <h4 className="text-sm font-semibold text-white">
            {label || 'Looking for High-Speed Global CDN Storage & Media Hosting?'}
          </h4>
          <p className="text-xs text-zinc-400">
            {sublabel || 'Discover verified partner offers for unmetered high-bandwidth image distribution and cloud storage.'}
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-md shadow-purple-900/40 shrink-0"
        >
          <span>Explore Partner Offer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

/**
 * ==============================================================================
 * LAYOUT-SPECIFIC AD SLOTS
 * ==============================================================================
 */

/**
 * 6. Responsive Banner Slot:
 * Dynamically switches banner sizes based on viewport width:
 * - Desktop (>= 768px): 728x90 Leaderboard
 * - Tablet (500px - 767px): 468x60 Banner
 * - Mobile (< 500px): 320x50 Mobile Leaderboard
 */
export interface ResponsiveBannerSlotProps {
  className?: string;
  showBadge?: boolean;
}

export const ResponsiveBannerSlot: React.FC<ResponsiveBannerSlotProps> = ({
  className = '',
  showBadge = true,
}) => {
  const [format, setFormat] = useState<BannerSize>('728x90');

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setFormat('728x90');
      } else if (width >= 500) {
        setFormat('468x60');
      } else {
        setFormat('320x50');
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <BannerAdUnit
      format={format}
      className={className}
      showBadge={showBadge}
    />
  );
};

/**
 * 7. Footer Banner Slot:
 * Placed cleanly inside or above the footer across the website.
 */
export const FooterBannerSlot: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full max-w-5xl mx-auto px-4 py-6 border-t border-zinc-800/60 ${className}`}>
      <ResponsiveBannerSlot showBadge={true} />
    </div>
  );
};

/**
 * 8. Sidebar Banner Slot:
 * Configurable for desktop sidebars (160x600 skyscraper, 160x300 half skyscraper, or 300x250 rectangle).
 */
export interface SidebarBannerSlotProps {
  format?: '160x600' | '160x300' | '300x250';
  className?: string;
  showBadge?: boolean;
}

export const SidebarBannerSlot: React.FC<SidebarBannerSlotProps> = ({
  format = '160x600',
  className = '',
  showBadge = true,
}) => {
  return (
    <div className={`flex flex-col items-center my-4 ${className}`}>
      <BannerAdUnit
        format={format}
        showBadge={showBadge}
      />
    </div>
  );
};

/**
 * ==============================================================================
 * MASTER AD UNITS COMPONENT & EXPORT
 * ==============================================================================
 */

/**
 * Global component to mount at App root for dynamic injection of popunder and social bar
 */
export const GlobalAdUnits: React.FC<{
  popunder?: boolean;
  socialBar?: boolean;
}> = ({ popunder = true, socialBar = true }) => {
  useAdsterraGlobalAds({ popunder, socialBar });
  return null;
};

/**
 * Default composite export providing quick access to all components
 */
export const AdUnits = {
  Popunder: PopunderAdUnit,
  SocialBar: SocialBarAdUnit,
  Banner: BannerAdUnit,
  NativeBanner: NativeBannerUnit,
  Smartlink: SmartlinkUnit,
  ResponsiveSlot: ResponsiveBannerSlot,
  FooterSlot: FooterBannerSlot,
  SidebarSlot: SidebarBannerSlot,
  Global: GlobalAdUnits,
  config: ADSTERRA_UNITS,
};

export default AdUnits;
