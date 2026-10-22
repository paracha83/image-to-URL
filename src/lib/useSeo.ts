import { useEffect } from 'react';
import { applyPageSeo, PageSeoConfig } from './seoConfig';

export function useSeo(config: PageSeoConfig = {}) {
  useEffect(() => {
    applyPageSeo(config);
  }, [config.title, config.description, config.canonicalPath, config.image, config.type]);
}
