'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PostEditor from '@/components/PostEditor';
import Link from 'next/link';
import type { Post } from '@/types';

export default function EditPostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setPost(data.data);
      } else {
        setError(data.error || 'Failed to fetch post');
      }
    } catch (err) {
      setError('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-[#6B6B6B]">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link href="/admin" className="text-sm hover:text-black">
            ← Back to Dashboard
          </Link>
        </div>
        <p className="text-red-600" role="alert">
          {error || 'Post not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link href="/admin" className="text-sm hover:text-black">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-4xl mb-12">Edit Post</h1>

      <PostEditor post={post} mode="edit" />
    </div>
  );
}
