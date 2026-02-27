'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { formatDate } from '@/lib/markdown';
import type { PostMetadata } from '@/types';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();

      if (data.success) {
        setPosts(data.data);
      } else {
        setError(data.error || 'Failed to fetch posts');
      }
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setPosts(posts.filter((p) => p.id !== id));
      } else {
        alert(data.error || 'Failed to delete post');
      }
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link
            href="/admin/about"
            className="px-6 py-2 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAFAFA] transition-colors no-underline"
          >
            Edit About
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAFAFA] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mb-8">
        <Link
          href="/admin/posts/new"
          className="inline-block bg-[#1A1A1A] text-[#FAFAFA] px-6 py-3 hover:bg-black transition-colors no-underline"
        >
          Create New Post
        </Link>
      </div>

      {loading && <p className="text-[#6B6B6B]">Loading posts...</p>}

      {error && (
        <p className="text-red-600" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="text-[#6B6B6B]">No posts yet. Create your first post!</p>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="border border-[#E0E0E0]">
          <table className="w-full">
            <thead className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
              <tr>
                <th className="text-left p-4 font-normal">Title</th>
                <th className="text-left p-4 font-normal">Status</th>
                <th className="text-left p-4 font-normal">Date</th>
                <th className="text-left p-4 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-[#E0E0E0]">
                  <td className="p-4">{post.title}</td>
                  <td className="p-4">
                    <span
                      className={
                        post.status === 'published'
                          ? 'text-green-700'
                          : 'text-[#6B6B6B]'
                      }
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-[#6B6B6B]">
                    {formatDate(post.date)}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-sm hover:text-black"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                      {post.status === 'published' && (
                        <Link
                          href={`/posts/${post.slug}`}
                          target="_blank"
                          className="text-sm hover:text-black"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
