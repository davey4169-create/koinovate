// ============================================================
// next.config.mjs
// ============================================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Using remotePatterns instead of deprecated 'domains'
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Suppress the Turbopack telemetry warning
  experimental: {
    // Remove optimizeCss if it causes issues
  },
}

export default nextConfig