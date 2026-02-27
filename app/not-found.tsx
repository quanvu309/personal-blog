import Link from 'next/link';

export const metadata = {
  title: '404 - Page Not Found',
};

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-6xl mb-6">404</h1>
      <p className="text-xl mb-8 text-[#6B6B6B]">Page not found</p>
      <Link
        href="/"
        className="inline-block bg-[#1A1A1A] text-[#FAFAFA] px-8 py-3 hover:bg-black transition-colors no-underline"
      >
        Go Home
      </Link>
    </div>
  );
}
