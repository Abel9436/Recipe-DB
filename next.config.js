/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [{
            source: '/:path*',
            headers: [{
                    key: 'Content-Security-Policy',
                    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.groq.com https://www.themealdb.com;"
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
                },
                {
                    key: 'Permissions-Policy',
                    value: 'camera=(), microphone=(), geolocation=()'
                }
            ]
        }]
    }
}

module.exports = nextConfig