/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: "http://localhost:3000/api/:path*" }];
  },
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
