import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { generateSlug } from '@/lib/markdown';
import { v4 as uuidv4 } from 'uuid';
import type { CreatePostRequest, Post } from '@/types';

// GET /api/posts - List all posts (admin only)
export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const sql = getDb();
    const posts = await sql`
      SELECT
        id, title, slug, content, date, status,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM posts
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body: CreatePostRequest = await request.json();

    // Validate required fields
    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    if (!body.status || !['draft', 'published'].includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Generate post data
    const id = uuidv4();
    const slug = generateSlug(body.title);
    const now = new Date();

    // Insert into database
    const sql = getDb();
    const [post] = await sql`
      INSERT INTO posts (id, title, slug, content, date, status, created_at, updated_at)
      VALUES (${id}, ${body.title}, ${slug}, ${body.content}, ${now.toISOString()}, ${body.status}, ${now.toISOString()}, ${now.toISOString()})
      RETURNING
        id, title, slug, content, date, status,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
