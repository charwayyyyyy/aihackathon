/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-hackathon.codedematrixtech.com',
      },
    ],
  },
};

module.exports = nextConfig;