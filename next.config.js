/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/yuyutei-market",
          destination: "https://tcginvent.vercel.app/api/yuyutei-market",
        },
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
