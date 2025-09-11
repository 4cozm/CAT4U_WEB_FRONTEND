/** @type {import('next').NextConfig} */
const nextConfig = {
  async reWrites() {
    return [{ source: "/api/:path*", destination: "http://localhost:3000/:path*" }];
  },
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
