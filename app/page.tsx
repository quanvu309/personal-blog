import Link from 'next/link';
import { getAllPublishedPosts } from '@/lib/posts';
import { formatDate } from '@/lib/markdown';

export default function HomePage() {
  const posts = getAllPublishedPosts();

  return (
    <div>
      <h1 className="mb-12">Recent Posts</h1>

      {posts.length === 0 ? (
        <p className="text-[#6B6B6B]">No posts yet.</p>
      ) : (
        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.id}>
              <Link
                href={`/posts/${post.slug}`}
                className="no-underline hover:text-black"
              >
                <h2 className="mt-0 mb-2">{post.title}</h2>
              </Link>
              <time className="text-sm text-[#6B6B6B]">
                {formatDate(post.date)}
              </time>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
