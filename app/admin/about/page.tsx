'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditAboutPage() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch('/api/about');
      const data = await response.json();

      if (data.success) {
        setContent(data.data.content);
      } else if (response.status === 404) {
        setContent('');
      } else {
        setError(data.error || 'Failed to fetch About page');
      }
    } catch (err) {
      setError('Failed to fetch About page');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save About page');
      }
    } catch (err) {
      setError('Failed to save About page');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-[#6B6B6B]">Loading...</p>
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

      <h1 className="text-4xl mb-12">Edit About Page</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            {isLoading ? 'Saving...' : 'Save Changes'}
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
    </div>
  );
}
