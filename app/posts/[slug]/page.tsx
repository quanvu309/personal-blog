import { notFound } from 'next/navigation';
import { getAllPublishedPosts, getPostBySlug } from '@/lib/posts';
import { markdownToHtml, formatDate } from '@/lib/markdown';

export async function generateStaticParams() {
  const posts = await getAllPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Camthoi`,
    description: post.content.slice(0, 160),
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Return 404 if post not found or is a draft
  if (!post || post.status !== 'published') {
    notFound();
  }

  const htmlContent = markdownToHtml(post.content);

  return (
    <article>
      <header className="mb-12">
        <h1 className="mb-4">{post.title}</h1>
        <time className="text-sm text-[#6B6B6B]">
          {formatDate(post.date)}
        </time>
      </header>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </article>
  );
}
