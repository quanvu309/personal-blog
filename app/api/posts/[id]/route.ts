import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { generateSlug } from '@/lib/markdown';
import type { UpdatePostRequest } from '@/types';

// GET /api/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const sql = getDb();

    const [post] = await sql`
      SELECT
        id, title, slug, content, date, status,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM posts
      WHERE id = ${id}
    `;

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PATCH /api/posts/[id] - Update post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const sql = getDb();

    // Check if post exists
    const [existingPost] = await sql`
      SELECT id FROM posts WHERE id = ${id}
    `;

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    const body: UpdatePostRequest = await request.json();

    // Validate fields if provided
    if (body.title !== undefined && body.title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Title cannot be empty' },
        { status: 400 }
      );
    }

    if (body.content !== undefined && body.content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content cannot be empty' },
        { status: 400 }
      );
    }

    if (
      body.status !== undefined &&
      !['draft', 'published'].includes(body.status)
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (body.title !== undefined) {
      const newSlug = generateSlug(body.title);
      updates.push('title = $' + (values.length + 1));
      values.push(body.title);
      updates.push('slug = $' + (values.length + 1));
      values.push(newSlug);
    }

    if (body.content !== undefined) {
      updates.push('content = $' + (values.length + 1));
      values.push(body.content);
    }

    if (body.status !== undefined) {
      updates.push('status = $' + (values.length + 1));
      values.push(body.status);
    }

    // Always update updated_at
    updates.push('updated_at = $' + (values.length + 1));
    values.push(new Date().toISOString());

    values.push(id); // Add id for WHERE clause

    const [updatedPost] = await sql`
      UPDATE posts
      SET
        ${body.title !== undefined ? sql`title = ${body.title}, slug = ${generateSlug(body.title)},` : sql``}
        ${body.content !== undefined ? sql`content = ${body.content},` : sql``}
        ${body.status !== undefined ? sql`status = ${body.status},` : sql``}
        updated_at = ${new Date().toISOString()}
      WHERE id = ${id}
      RETURNING
        id, title, slug, content, date, status,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const sql = getDb();

    const result = await sql`
      DELETE FROM posts
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
