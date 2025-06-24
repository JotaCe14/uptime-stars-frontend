import type { NextConfig } from "next";

const API_BASE_URL = process.env.API_BASE_URL || "https://localhost/api/v1";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/monitor/:path*',
                destination: `${API_BASE_URL}/monitor/:path*`,
            },
            {
                source: '/api/monitor',
                destination: `${API_BASE_URL}/monitor`,
            },
            {
                source: '/api/event',
                destination: `${API_BASE_URL}/event`,
            },
            {
                source: '/api/event/:path',
                destination: `${API_BASE_URL}/event/:path*`,
            },
            {
                source: '/api/group',
                destination: `${API_BASE_URL}/group`,
            },
            {
                source: '/api/group/:path',
                destination: `${API_BASE_URL}/group/:path*`,
            },
        ];
    },
};

export default nextConfig;
