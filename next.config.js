/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use export for production build, not in dev
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
