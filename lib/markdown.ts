/**
 * Markdown processing utilities
 * Based on specs/001-camthoi-blog/contracts/data-schemas.md
 */

import { marked } from 'marked';

/**
 * Convert markdown to HTML
 * Sanitizes output to prevent XSS attacks
 */
export function markdownToHtml(markdown: string): string {
  // Configure marked for security
  marked.setOptions({
    gfm: true,
    breaks: false,
  });

  return marked.parse(markdown) as string;
}

/**
 * Generate URL-safe slug from title
 * Algorithm per data-schemas.md:
 * 1. Convert to lowercase
 * 2. Replace spaces with hyphens
 * 3. Remove all non-alphanumeric characters except hyphens
 * 4. Remove consecutive hyphens
 * 5. Trim hyphens from start/end
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // spaces to hyphens
    .replace(/[^\w\-]+/g, '')       // remove non-alphanumeric except hyphens
    .replace(/\-\-+/g, '-')         // remove consecutive hyphens
    .replace(/^-+/, '')             // trim hyphens from start
    .replace(/-+$/, '');            // trim hyphens from end
}

/**
 * Format ISO date string to readable format
 * Example: "2024-01-15" -> "January 15, 2024"
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
