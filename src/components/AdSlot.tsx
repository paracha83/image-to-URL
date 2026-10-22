import React from 'react';
import {
  BannerAdUnit,
  ResponsiveBannerSlot,
  NativeBannerUnit,
  SmartlinkUnit,
  BannerSize,
} from './AdUnits';

export interface AdSlotProps {
  id?: string;
  format?: BannerSize | 'responsive' | 'native' | 'smartlink';
  className?: string;
  showSponsoredBadge?: boolean;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  id = 'ad-slot',
  format = 'responsive',
  className = '',
  showSponsoredBadge = true,
}) => {
  return (
    <div id={id} className={`w-full ${className}`} data-ad-slot={id}>
      {format === 'responsive' && (
        <ResponsiveBannerSlot showBadge={showSponsoredBadge} />
      )}
      {format === 'native' && <NativeBannerUnit />}
      {format === 'smartlink' && <SmartlinkUnit />}
      {format !== 'responsive' && format !== 'native' && format !== 'smartlink' && (
        <BannerAdUnit
          format={format}
          showBadge={showSponsoredBadge}
        />
      )}
    </div>
  );
};
