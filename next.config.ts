import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel já gere o servidor; não use `output: 'standalone'` em deploy para Vercel
  reactStrictMode: true,
  images: {
    // Permitir imagens servidas pelo S3 público do PJC
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.pjc.mt.gov.br',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3dev.pjc.mt.gov.br',
        pathname: '/**',
      },
    ],
    // Configurações para URLs assinadas do S3/MinIO
    unoptimized: process.env.NODE_ENV === 'production', // Desabilitar otimização na produção se houver problemas
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Fallback para domínios (deprecated mas pode ajudar)
  domains: ['s3.pjc.mt.gov.br', 's3dev.pjc.mt.gov.br'],
  },
  // Reescrever URLs para usar API routes internas (evita problemas com Vercel)
  async rewrites() {
    return [
      // Rotas de Pessoas
      {
        source: '/pessoas/aberto',
        destination: '/api/pessoas/aberto',
      },
      {
        source: '/pessoas/aberto/filtro',
        destination: '/api/pessoas/aberto/filtro',
      },
      {
        source: '/pessoas/aberto/estatistico',
        destination: '/api/pessoas/aberto/estatistico',
      },
      {
        source: '/pessoas/aberto/dinamico',
        destination: '/api/pessoas/aberto/dinamico',
      },
      {
        source: '/pessoas/:id',
        destination: '/api/pessoas/:id',
      },
      // Rotas de Ocorrências
      {
        source: '/ocorrencias/informacoes-desaparecido',
        destination: '/api/ocorrencias/informacoes-desaparecido',
      },
      {
        source: '/ocorrencias/delegacia-digital',
        destination: '/api/ocorrencias/delegacia-digital',
      },
      {
        source: '/ocorrencias/delegacia-digital/verificar-duplicidade',
        destination: '/api/ocorrencias/delegacia-digital/verificar-duplicidade',
      },
      {
        source: '/ocorrencias/motivos',
        destination: '/api/ocorrencias/motivos',
      },
      // Rotas de Autenticação
      {
        source: '/login',
        destination: '/api/auth/login',
      },
      {
        source: '/refresh-token',
        destination: '/api/auth/refresh-token',
      },
    ];
  },
  // Configurações para preservar rotas e evitar conflitos com a Vercel
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  // Configurar headers para APIs
  async headers() {
    return [
      {
        source: '/api/pessoas/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
      {
        source: '/api/ocorrencias/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=30, stale-while-revalidate=60',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
      {
        source: '/api/auth/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
