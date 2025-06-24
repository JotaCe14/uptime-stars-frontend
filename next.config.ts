import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/monitor/:path*',
                destination: 'https://uptime-stars-backend-api-production.up.railway.app/api/v1/monitor/:path*',
            },
            {
                source: '/api/monitor',
                destination: 'https://uptime-stars-backend-api-production.up.railway.app/api/v1/monitor',
            },
            {
                source: '/api/event',
                destination: 'https://uptime-stars-backend-api-production.up.railway.app/api/v1/event',
            },
            {
                source: '/api/event/:path',
                destination: 'https://uptime-stars-backend-api-production.up.railway.app/api/v1/event/:path*',
            },
            {
                source: '/api/group',
                destination: 'https://uptime-stars-backend-api-production.up.railway.app/api/v1/group',
            },
            {
                source: '/api/group/:path',
                destination: 'https://uptime-stars-backend-api-production.up.railway.app/api/v1/group/:path*',
            },
        ];
    },
};

export default nextConfig;
