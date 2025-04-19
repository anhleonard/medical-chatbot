/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['letsenhance.io', 'storage.googleapis.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'letsenhance.io',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '/**',
            },
        ],
    },
    output: "standalone"
};

export default nextConfig;
