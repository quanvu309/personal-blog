import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAboutContent } from '@/lib/posts';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const aboutPath = path.join(process.cwd(), 'content/about.md');

// GET /api/about - Get About page content
export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const about = getAboutContent();

    if (!about) {
      return NextResponse.json(
        { success: false, error: 'About page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: about });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch About page' },
      { status: 500 }
    );
  }
}

// PUT /api/about - Update About page content
export async function PUT(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    const updatedAt = new Date().toISOString();

    const frontmatter = {
      updatedAt,
    };

    const fileContent = matter.stringify(body.content, frontmatter);

    // Ensure directory exists
    const contentDir = path.dirname(aboutPath);
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(aboutPath, fileContent);

    return NextResponse.json({
      success: true,
      data: { content: body.content, updatedAt },
    });
  } catch (error) {
    console.error('Error updating About page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update About page' },
      { status: 500 }
    );
  }
}
