/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow NextAuth to auto-detect the URL on Vercel
  // No need to hardcode NEXTAUTH_URL when VERCEL_URL is available
};

module.exports = nextConfig;
