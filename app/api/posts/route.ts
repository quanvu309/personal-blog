import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAllPosts } from '@/lib/posts';
import { generateSlug } from '@/lib/markdown';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { CreatePostRequest, ApiResponse, Post } from '@/types';

const postsDirectory = path.join(process.cwd(), 'content/posts');

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
    const posts = getAllPosts();
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
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
    const now = new Date().toISOString();

    const post: Post = {
      id,
      title: body.title,
      slug,
      content: body.content,
      date: now,
      status: body.status,
      createdAt: now,
      updatedAt: now,
    };

    // Create frontmatter
    const frontmatter = {
      title: post.title,
      slug: post.slug,
      date: post.date,
      status: post.status,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    const fileContent = matter.stringify(post.content, frontmatter);

    // Ensure directory exists
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    // Write file
    const filePath = path.join(postsDirectory, `${id}.md`);
    fs.writeFileSync(filePath, fileContent);

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
