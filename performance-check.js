// Performance monitoring script
// Run with: node performance-check.js

const https = require('https');
const http = require('http');

const urls = [
  'http://localhost:3000',
  'http://localhost:3000/academy',
  'http://localhost:3000/newsroom',
  'http://localhost:3000/api/coingecko/global',
  'http://localhost:3000/api/sanity/query?query=*[_type=="article"]'
];

async function checkPerformance(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        resolve({
          url,
          status: res.statusCode,
          duration,
          size: data.length,
          headers: {
            'cache-control': res.headers['cache-control'],
            'etag': res.headers['etag'] ? 'Present' : 'Missing'
          }
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        error: error.message,
        duration: Date.now() - startTime
      });
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      resolve({
        url,
        error: 'Timeout',
        duration: Date.now() - startTime
      });
    });
  });
}

async function runPerformanceCheck() {
  console.log('🚀 Starting Performance Check...\n');
  
  const results = [];
  
  for (const url of urls) {
    console.log(`Testing: ${url}`);
    const result = await checkPerformance(url);
    results.push(result);
    
    if (result.error) {
      console.log(`❌ Error: ${result.error} (${result.duration}ms)\n`);
    } else {
      console.log(`✅ Status: ${result.status} | Time: ${result.duration}ms | Size: ${(result.size / 1024).toFixed(2)}KB`);
      console.log(`   Cache: ${result.headers['cache-control'] || 'None'} | ETag: ${result.headers.etag}\n`);
    }
  }
  
  // Summary
  console.log('📊 Performance Summary:');
  console.log('=======================');
  
  const successful = results.filter(r => !r.error);
  const failed = results.filter(r => r.error);
  
  if (successful.length > 0) {
    const avgTime = successful.reduce((sum, r) => sum + r.duration, 0) / successful.length;
    const totalSize = successful.reduce((sum, r) => sum + r.size, 0);
    
    console.log(`✅ Successful requests: ${successful.length}/${urls.length}`);
    console.log(`⏱️  Average response time: ${avgTime.toFixed(2)}ms`);
    console.log(`📦 Total data size: ${(totalSize / 1024).toFixed(2)}KB`);
    console.log(`🚀 Performance rating: ${avgTime < 1000 ? 'Excellent' : avgTime < 2000 ? 'Good' : avgTime < 5000 ? 'Fair' : 'Poor'}`);
  }
  
  if (failed.length > 0) {
    console.log(`❌ Failed requests: ${failed.length}`);
    failed.forEach(f => console.log(`   - ${f.url}: ${f.error}`));
  }
  
  console.log('\n💡 Recommendations:');
  if (successful.length > 0) {
    const avgTime = successful.reduce((sum, r) => sum + r.duration, 0) / successful.length;
    
    if (avgTime > 2000) {
      console.log('   - Consider implementing more aggressive caching');
      console.log('   - Optimize database queries');
      console.log('   - Use CDN for static assets');
    }
    
    if (avgTime > 5000) {
      console.log('   - Implement request timeouts');
      console.log('   - Consider server-side caching (Redis)');
      console.log('   - Optimize bundle size');
    }
  }
}

// Run the check
runPerformanceCheck().catch(console.error); 