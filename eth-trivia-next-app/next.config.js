/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: config => {
    config.resolve.fallback = {
      url: false,
        fs: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        url: false,
        os: false,
        assert: false
      };

    return config;
  },
}

module.exports = nextConfig
