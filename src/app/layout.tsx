/* eslint-disable react-refresh/only-export-components */
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";
import GlobalErrorHandler from "../components/GlobalErrorHandler";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "../components/auth/AuthProvider";
import { AuthGuard } from "../components/auth/AuthGuard";

import ConsoleSilencer from "../components/ConsoleSilencer";
import PerformanceMonitor from "../components/PerformanceMonitor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beluga - Platform Crypto Indonesia Terdepan",
  description: "Beluga adalah platform cryptocurrency Indonesia yang menyediakan berita, analisis, dan informasi terkini tentang dunia crypto dan blockchain.",
  keywords: "crypto, cryptocurrency, bitcoin, ethereum, blockchain, indonesia, berita crypto, analisis crypto",
  authors: [{ name: "Beluga Team" }],
  creator: "Beluga",
  publisher: "Beluga",
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://beluga.id' : 'http://localhost:3000'),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/Asset/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/Asset/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/Asset/beluganewlogov2.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Beluga - Platform Crypto Indonesia Terdepan",
    description: "Platform cryptocurrency Indonesia yang menyediakan berita, analisis, dan informasi terkini tentang dunia crypto dan blockchain.",
    url: "https://beluga.id",
    siteName: "Beluga",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/Asset/beluganewlogov2.png",
        width: 669,
        height: 514,
        alt: "Beluga Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beluga - Platform Crypto Indonesia Terdepan",
    description: "Platform cryptocurrency Indonesia yang menyediakan berita, analisis, dan informasi terkini tentang dunia crypto dan blockchain.",
    images: ["/Asset/beluganewlogov2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// CRITICAL FIX: Font configuration with literal values for Next.js compatibility
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Disable preloading to prevent font manifest errors
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Disable preloading for non-critical font
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N7L2LJN5');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdn.sanity.io" />
        <link rel="dns-prefetch" href="//assets.coingecko.com" />
        <link rel="dns-prefetch" href="//api.coingecko.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="//vitals.vercel-insights.com" />
        
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7124893522977923"
          crossOrigin="anonymous"
        />
        
        {/* Performance optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#141722" />
        <meta name="color-scheme" content="dark" />
        
        {/* Favicon - match navbar logo using pre-generated 4K cropped PNG and ico (v2) */}
        <link rel="icon" href="/favicon.ico?v=6" />
        <link rel="icon" type="image/png" sizes="32x32" href="/Asset/favicon-32x32.png?v=6" />
        <link rel="icon" type="image/png" sizes="16x16" href="/Asset/favicon-16x16.png?v=6" />
        <link rel="apple-touch-icon" href="/Asset/beluganewlogov2.png?v=1" />
        <link rel="manifest" href="/site.webmanifest?v=4" />
        <meta name="msapplication-config" content="/browserconfig.xml?v=4" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* Remove dynamic processing: using built assets */}
        {/* Structured Data: WebSite with Sitelinks Search Box */}
        <script
          type="application/ld+json"
          // JSON-LD for WebSite schema enabling Sitelinks Search Box in Google
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Beluga',
              url: process.env.NODE_ENV === 'production' ? 'https://beluga.id' : 'http://localhost:3000',
              potentialAction: {
                '@type': 'SearchAction',
                target:
                  (process.env.NODE_ENV === 'production'
                    ? 'https://beluga.id'
                    : 'http://localhost:3000') + '/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* Structured Data: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Beluga',
              url: process.env.NODE_ENV === 'production' ? 'https://beluga.id' : 'http://localhost:3000',
              logo:
                (process.env.NODE_ENV === 'production'
                  ? 'https://beluga.id'
                  : 'http://localhost:3000') + '/Asset/beluganewlogov2.png',
            }),
          }}
        />
        {/* Error hardening for noisy browser extensions and SW handling */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle browser extension errors
              window.addEventListener('error', function(e) {
                if (e.message.includes('runtime.lastError') || 
                    e.message.includes('message port closed') ||
                    e.filename.includes('chrome-extension') ||
                    e.filename.includes('moz-extension')) {
                  e.preventDefault();
                  return false;
                }
              });
              
              // Handle unhandled promise rejections
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.message && 
                    (e.reason.message.includes('runtime.lastError') || 
                     e.reason.message.includes('message port closed'))) {
                  e.preventDefault();
                  return false;
                }
              });

              // Service Worker: enable only in production, disable/unregister in development
              if ('serviceWorker' in navigator) {
                const __ENV__ = '${process.env.NODE_ENV || 'development'}';
                if (__ENV__ === 'production') {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                  });
                } else {
                  // Unregister any existing service workers during development to avoid stale caches
                  navigator.serviceWorker.getRegistrations()
                    .then(function(registrations) {
                      registrations.forEach(function(reg) { reg.unregister(); });
                    })
                    .catch(function(err) { console.log('SW unregister error:', err); });
                  // Also clear caches that may hold old _next assets
                  if (window.caches) {
                    caches.keys().then(function(keys) {
                      keys.forEach(function(key) {
                        if (key.includes('next') || key.includes('workbox')) {
                          caches.delete(key);
                        }
                      });
                    });
                  }
                }
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-duniacrypto-bg-darker`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N7L2LJN5"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ErrorBoundary>
          <AuthProvider>
            <AuthGuard>
              <GlobalErrorHandler />
              <div className="min-h-screen flex flex-col">
                <ConsoleSilencer />
                <PerformanceMonitor />
                <Navbar />
                <main className="flex-1 xl:ml-20">
                  {children}
                </main>
                <Footer />
              </div>
            </AuthGuard>
          </AuthProvider>
        </ErrorBoundary>
        <Analytics />
        {/* Vercel Speed Insights - Mengumpulkan metrik performa saat user navigasi antar halaman */}
        {/* Catatan: Data dikirim saat window blur/unload, jadi perlu navigasi antar halaman untuk trigger */}
        {/* Pastikan content blockers dinonaktifkan untuk Speed Insights dapat bekerja */}
        <SpeedInsights />
      </body>
    </html>
  );
}
