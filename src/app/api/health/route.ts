import { NextResponse } from 'next/server';

export async function GET() {
  try {

  const healthCheck = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
  environment: process.env.NODE_ENV,
  version: process.env.npm_package_version || '1.0.0',
  checks: {
    server: 'ok'
  }
  };

  return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
  const errorResponse = {
  status: 'unhealthy',
  timestamp: new Date().toISOString(),
  error: error instanceof Error ? error.message : 'Unknown error'
  };

  return NextResponse.json(errorResponse, { status: 503 });
  }
}

export async function HEAD() {

  return new Response(null, { status: 200 });
}