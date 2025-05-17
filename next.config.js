/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['www.themealdb.com'],
    },
    async headers() {
        return [{
            source: '/:path*',
            headers: [{
                    key: 'Content-Security-Policy',
                    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.youtube-nocookie.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.themealdb.com; font-src 'self' data:; frame-src https://www.youtube.com https://www.youtube-nocookie.com;"
                },
                {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff'
                },
                {
                    key: 'X-Frame-Options',
                    value: 'DENY'
                },
                {
                    key: 'X-XSS-Protection',
                    value: '1; mode=block'
                },
                {
                    key: 'Referrer-Policy',
                    value: 'strict-origin-when-cross-origin'
                }
            ]
        }];
    }
};

module.exports = nextConfig;