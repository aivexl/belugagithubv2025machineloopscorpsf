# Performance Troubleshooting Guide

## Masalah yang Ditemukan dan Solusi

### 1. Babel Plugin Missing ❌ → ✅ SOLVED
**Error**: `Cannot find module 'babel-plugin-styled-components'`

**Solusi**:
```bash
npm install babel-plugin-styled-components --save-dev
```

### 2. Turbopack Conflict ❌ → ✅ SOLVED
**Error**: `Babel is not yet supported. To use Turbopack`

**Solusi**:
- Hapus file `.babelrc`
- Gunakan Next.js default tanpa Turbo mode
- Update `package.json` scripts

### 3. File System Slow ⚠️ → MONITORING
**Warning**: `Slow filesystem detected. The benchmark took 219ms`

**Kemungkinan Penyebab**:
- Antivirus scanning project directory
- Network drive atau cloud sync
- Disk space penuh

**Solusi**:
1. **Exclude project dari Antivirus**:
   - Windows Defender: Add exclusion untuk `E:\duniacrypto v2`
   - Antivirus lain: Exclude project folder

2. **Move project ke local drive**:
   - Pindahkan dari network drive ke local SSD
   - Pastikan ada cukup disk space

3. **Disable cloud sync**:
   - OneDrive, Google Drive, Dropbox
   - Exclude `.next` folder dari sync

### 4. Webpack Cache Issues ❌ → ✅ SOLVED
**Error**: `Caching failed for pack`

**Solusi**:
```bash
# Clear cache
Remove-Item -Recurse -Force .next

# Restart development server
npm run dev
```

## Konfigurasi yang Dioptimasi

### next.config.js (Simplified)
```javascript
const nextConfig = {
  // Optimize images
  images: {
    domains: ['assets.coingecko.com', 's3.tradingview.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimize for development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};
```

### package.json (Updated)
```json
{
  "scripts": {
    "dev": "next dev",
    "dev:fast": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

## Performance Monitoring

### Metrics yang Dipantau:
- ⏱️ **Compilation Time**: Target < 15 detik
- 💾 **Memory Usage**: Target < 1GB
- 🔄 **Hot Reload**: Target < 3 detik
- 📦 **Bundle Size**: Target < 2MB

### Tools untuk Monitoring:
1. **Chrome DevTools**: Performance tab
2. **React DevTools**: Profiler
3. **Task Manager**: Memory usage
4. **Next.js Built-in**: Compilation stats

## Best Practices

### 1. Development Environment
```bash
# Gunakan development mode yang stabil
npm run dev

# Clear cache secara berkala
Remove-Item -Recurse -Force .next
```

### 2. File System Optimization
- Gunakan SSD untuk development
- Exclude project dari antivirus
- Disable cloud sync untuk `.next` folder
- Monitor disk space

### 3. Code Optimization
- Gunakan React.memo untuk components
- Lazy load components yang besar
- Optimize images dan assets
- Monitor bundle size

## Troubleshooting Checklist

### Jika Kompilasi Lama:
- [ ] Clear cache: `Remove-Item -Recurse -Force .next`
- [ ] Restart development server
- [ ] Check antivirus exclusions
- [ ] Monitor disk space
- [ ] Check untuk circular dependencies

### Jika Ada Memory Issues:
- [ ] Restart development server
- [ ] Monitor Node.js memory usage
- [ ] Check untuk memory leaks
- [ ] Gunakan `--max-old-space-size=4096` jika perlu

### Jika Ada File System Issues:
- [ ] Exclude project dari antivirus
- [ ] Move ke local SSD
- [ ] Disable cloud sync
- [ ] Check disk permissions

## Kesimpulan

Setelah optimasi:
- ✅ Babel plugin issues: SOLVED
- ✅ Turbopack conflicts: SOLVED  
- ✅ Webpack cache issues: SOLVED
- ⚠️ File system performance: MONITORING

**Development server sekarang stabil dan performant!** 🚀 