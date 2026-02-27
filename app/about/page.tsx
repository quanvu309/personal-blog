import { getAboutContent } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';

export const metadata = {
  title: 'About - Camthoi',
  description: 'About this blog',
};

export default function AboutPage() {
  const about = getAboutContent();

  if (!about) {
    return (
      <div>
        <h1 className="mb-12">About</h1>
        <p className="text-[#6B6B6B]">
          No about page content available yet.
        </p>
      </div>
    );
  }

  const htmlContent = markdownToHtml(about.content);

  return (
    <article>
      <h1 className="mb-12">About</h1>
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </article>
  );
}
