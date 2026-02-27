import PostEditor from '@/components/PostEditor';
import Link from 'next/link';

export const metadata = {
  title: 'Create New Post - Admin',
};

export default function NewPostPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link href="/admin" className="text-sm hover:text-black">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-4xl mb-12">Create New Post</h1>

      <PostEditor mode="create" />
    </div>
  );
}
