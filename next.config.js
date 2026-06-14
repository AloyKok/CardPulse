/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/admin",
          destination: "https://tcginvent.vercel.app/admin",
        },
        {
          source: "/admin/:path*",
          destination: "https://tcginvent.vercel.app/admin/:path*",
        },
      ],
    };
  },
};

module.exports = nextConfig;
