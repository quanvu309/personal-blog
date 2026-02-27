/**
 * Post management utilities
 * Based on specs/001-camthoi-blog/contracts/data-schemas.md
 * Updated to use Neon PostgreSQL database
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostMetadata } from '@/types';
import { getDb } from './db';

/**
 * Get all published posts sorted by date (newest first)
 */
export async function getAllPublishedPosts(): Promise<PostMetadata[]> {
  try {
    const sql = getDb();
    const posts = await sql`
      SELECT
        id, title, slug, date, status
      FROM posts
      WHERE status = 'published'
      ORDER BY date DESC
    `;

    return posts as PostMetadata[];
  } catch (error) {
    console.error('Error fetching published posts:', error);
    return [];
  }
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const sql = getDb();
    const [post] = await sql`
      SELECT
        id, title, slug, content, date, status,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM posts
      WHERE slug = ${slug}
    `;

    return (post as Post) || null;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

/**
 * Get About page content
 */
export function getAboutContent(): { content: string; updatedAt: string } | null {
  const aboutPath = path.join(process.cwd(), 'content/about.md');

  if (!fs.existsSync(aboutPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(aboutPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    content,
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}
