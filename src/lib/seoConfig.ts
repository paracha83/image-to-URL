/**
 * Centralized SEO & Metadata Configuration Module for Image To URL
 * Handles site-wide metadata, title templates, meta descriptions,
 * OpenGraph, Twitter Cards, and canonical URL generation based on APP_URL.
 */

// Determine base application URL
export const APP_BASE_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_URL) ||
  (typeof window !== 'undefined' && window.location.origin) ||
  'http://localhost:3000'
).replace(/\/$/, '');

export const SITE_NAME = 'Image To URL';
export const DEFAULT_TITLE = 'Image To URL — Convert Images to Shareable URLs';
export const DEFAULT_DESCRIPTION = 'Convert images into shareable URLs quickly and easily with Image To URL.';

export interface PageSeoConfig {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'article';
}

/**
 * Generate fully qualified canonical URL
 */
export function getCanonicalUrl(pathname: string = ''): string {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${APP_BASE_URL}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Formats page title using the standard title template
 */
export function formatPageTitle(pageTitle?: string): string {
  if (!pageTitle || pageTitle.trim() === '') {
    return DEFAULT_TITLE;
  }
  return `${pageTitle} | ${SITE_NAME}`;
}

/**
 * Updates DOM head tags for active page view
 */
export function applyPageSeo({
  title,
  description,
  canonicalPath,
  image,
  type = 'website',
}: PageSeoConfig) {
  if (typeof document === 'undefined') return;

  const fullTitle = formatPageTitle(title);
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = getCanonicalUrl(
    canonicalPath || (typeof window !== 'undefined' ? window.location.pathname : '/')
  );

  // 1. Title
  document.title = fullTitle;

  // 2. Meta description
  updateMetaTag('name', 'description', metaDescription);

  // 3. Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // 4. OpenGraph Tags
  updateMetaTag('property', 'og:site_name', SITE_NAME);
  updateMetaTag('property', 'og:type', type);
  updateMetaTag('property', 'og:title', fullTitle);
  updateMetaTag('property', 'og:description', metaDescription);
  updateMetaTag('property', 'og:url', canonicalUrl);
  if (image) {
    updateMetaTag('property', 'og:image', image);
  }

  // 5. Twitter Card Tags
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', fullTitle);
  updateMetaTag('name', 'twitter:description', metaDescription);
  if (image) {
    updateMetaTag('name', 'twitter:image', image);
  }
}

function updateMetaTag(attributeName: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector(`meta[${attributeName}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attributeName, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}
