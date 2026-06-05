import type { NextConfig } from "next";

const API_URL = process.env.API_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  // Docker icin: yalnizca gerekli dosyalari iceren kendi kendine yeten cikti
  // uretir (.next/standalone). Image'i cok kuculttur.
  output: "standalone",
  experimental: {
    optimizePackageImports: ['@next/font'],
    // Görsel yükleme uploadImage server action'ı üzerinden gider.
    // Varsayılan limit 1MB; backend 5MB'a izin verdiği için yükseltiyoruz.
    serverActions: {
      bodySizeLimit: '8mb',
    },
  },
  // Tarayıcıdan gelen /api/* istekleri (özellikle /api/media görselleri) backend'e proxy'lenir.
  // Sunucu-taraf (server action / RSC) çağrıları zaten API_URL ile doğrudan backend'e gider.
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${API_URL}/api/:path*` },
    ];
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  trailingSlash: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
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
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
