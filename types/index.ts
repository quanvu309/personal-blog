/**
 * Core data types for Camthoi blog
 * Based on specs/001-camthoi-blog/contracts/data-schemas.md
 */

export interface Post {
  id: string;           // UUID v4
  title: string;
  slug: string;         // Auto-generated from title
  content: string;      // Markdown content
  date: string;         // ISO 8601 format (publication date)
  status: 'draft' | 'published';
  createdAt: string;    // ISO 8601 format
  updatedAt: string;    // ISO 8601 format
}

export interface PostMetadata {
  id: string;
  title: string;
  slug: string;
  date: string;
  status: 'draft' | 'published';
}

export interface AboutPage {
  content: string;      // Markdown content
  updatedAt: string;    // ISO 8601 format
}

export interface CreatePostRequest {
  title: string;        // Min 1 char
  content: string;      // Min 1 char
  status: 'draft' | 'published';
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  status?: 'draft' | 'published';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
