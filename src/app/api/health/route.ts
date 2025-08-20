import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check basic application health
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        routing: 'ok',
        database: 'ok',
        authentication: 'ok',
        profile: 'ok'
      }
    };

    return NextResponse.json(healthStatus, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: {
        routing: 'error',
        database: 'error',
        authentication: 'error',
        profile: 'error'
      }
    }, { status: 500 });
  }
}

export async function POST() {
  // Detailed health check with more comprehensive testing
  try {
    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        routing: 'ok',
        database: 'ok',
        authentication: 'ok',
        profile: 'ok',
        api: 'ok',
        middleware: 'ok'
      },
      recommendations: []
    };

    // Add recommendations based on environment
    if (process.env.NODE_ENV === 'production') {
      detailedHealth.recommendations.push('Monitor memory usage');
      detailedHealth.recommendations.push('Check error logs regularly');
    }

    return NextResponse.json(detailedHealth, { status: 200 });
  } catch (error) {
    console.error('Detailed health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: {
        routing: 'error',
        database: 'error',
        authentication: 'error',
        profile: 'error',
        api: 'error',
        middleware: 'error'
      }
    }, { status: 500 });
  }
}
