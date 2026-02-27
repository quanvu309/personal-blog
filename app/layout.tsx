import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Camthoi',
  description: 'A minimalist personal blog',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Header */}
        <header className="border-b border-[#E0E0E0] py-8">
          <div className="max-w-[800px] mx-auto px-6">
            <nav className="flex items-center justify-between">
              <Link
                href="/"
                className="text-2xl font-normal no-underline hover:text-black"
              >
                Camthoi
              </Link>
              <Link
                href="/about"
                className="text-lg no-underline hover:text-black"
              >
                About
              </Link>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-[800px] mx-auto px-6 py-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#E0E0E0] py-8 mt-24">
          <div className="max-w-[800px] mx-auto px-6">
            <p className="text-sm text-[#6B6B6B] mb-0">
              © {new Date().getFullYear()} Camthoi. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
