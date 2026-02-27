/**
 * Post management utilities
 * Based on specs/001-camthoi-blog/contracts/data-schemas.md
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostMetadata } from '@/types';
import { generateSlug } from './markdown';

const postsDirectory = path.join(process.cwd(), 'content/posts');

/**
 * Get all published posts sorted by date (newest first)
 */
export function getAllPublishedPosts(): PostMetadata[] {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        id,
        title: data.title,
        slug: data.slug || generateSlug(data.title),
        date: data.date,
        status: data.status || 'published',
      } as PostMetadata;
    })
    .filter(post => post.status === 'published')
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return allPosts;
}

/**
 * Get all posts (including drafts) for admin interface
 */
export function getAllPosts(): PostMetadata[] {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        id,
        title: data.title,
        slug: data.slug || generateSlug(data.title),
        date: data.date,
        status: data.status || 'published',
      } as PostMetadata;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return allPosts;
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): Post | null {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  const fileNames = fs.readdirSync(postsDirectory);

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const postSlug = data.slug || generateSlug(data.title);

    if (postSlug === slug) {
      const id = fileName.replace(/\.md$/, '');

      return {
        id,
        title: data.title,
        slug: postSlug,
        content,
        date: data.date,
        status: data.status || 'published',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }
  }

  return null;
}

/**
 * Get a single post by ID
 */
export function getPostById(id: string): Post | null {
  const fullPath = path.join(postsDirectory, `${id}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    id,
    title: data.title,
    slug: data.slug || generateSlug(data.title),
    content,
    date: data.date,
    status: data.status || 'published',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
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
