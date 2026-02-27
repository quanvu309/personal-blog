import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPostById } from '@/lib/posts';
import { generateSlug } from '@/lib/markdown';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { UpdatePostRequest, Post } from '@/types';

const postsDirectory = path.join(process.cwd(), 'content/posts');

// GET /api/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const post = getPostById(params.id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PATCH /api/posts/[id] - Update post
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const post = getPostById(params.id);

    if (!post) {
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

    // Update post data
    const updatedPost: Post = {
      ...post,
      title: body.title ?? post.title,
      slug:
        body.title !== undefined
          ? generateSlug(body.title)
          : post.slug,
      content: body.content ?? post.content,
      status: body.status ?? post.status,
      updatedAt: new Date().toISOString(),
    };

    // Create frontmatter
    const frontmatter = {
      title: updatedPost.title,
      slug: updatedPost.slug,
      date: updatedPost.date,
      status: updatedPost.status,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    };

    const fileContent = matter.stringify(updatedPost.content, frontmatter);

    // Write file
    const filePath = path.join(postsDirectory, `${params.id}.md`);
    fs.writeFileSync(filePath, fileContent);

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
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const filePath = path.join(postsDirectory, `${params.id}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Delete file
    fs.unlinkSync(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
