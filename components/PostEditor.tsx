'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Post } from '@/types';

interface PostEditorProps {
  post?: Post;
  mode: 'create' | 'edit';
}

export default function PostEditor({ post, mode }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [status, setStatus] = useState<'draft' | 'published'>(
    post?.status || 'draft'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const url = mode === 'create' ? '/api/posts' : `/api/posts/${post?.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, status }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save post');
      }
    } catch (err) {
      setError('Failed to save post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-lg font-medium mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-[#E0E0E0] rounded-none focus:outline-none focus:ring-2 focus:ring-[#404040]"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-lg font-medium mb-2">
          Content (Markdown)
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="w-full px-4 py-3 border border-[#E0E0E0] rounded-none focus:outline-none focus:ring-2 focus:ring-[#404040] font-mono text-sm"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-lg font-medium mb-2">Status</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="draft"
              checked={status === 'draft'}
              onChange={(e) => setStatus(e.target.value as 'draft')}
              disabled={isLoading}
            />
            <span>Draft</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="published"
              checked={status === 'published'}
              onChange={(e) => setStatus(e.target.value as 'published')}
              disabled={isLoading}
            />
            <span>Published</span>
          </label>
        </div>
      </div>

      {error && (
        <p className="text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#1A1A1A] text-[#FAFAFA] px-8 py-3 hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create Post' : 'Update Post'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="border border-[#1A1A1A] px-8 py-3 hover:bg-[#1A1A1A] hover:text-[#FAFAFA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
