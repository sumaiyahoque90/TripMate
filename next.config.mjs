/** @type {import('next').NextConfig} */
const nextConfig = {
  // The app uses plain <img> tags, so the /_next/image optimizer endpoint is not needed. Disabling it removes that attack surface.
  images: { unoptimized: true },
};
export default nextConfig;
