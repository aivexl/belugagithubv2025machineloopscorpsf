import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "../contexts/AuthProvider";
import ConsoleSilencer from "../components/ConsoleSilencer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico?v=4" />
        <link rel="icon" type="image/png" sizes="32x32" href="/Asset/favicon-32x32.png?v=4" />
        <link rel="icon" type="image/png" sizes="16x16" href="/Asset/favicon-16x16.png?v=4" />
        <link rel="apple-touch-icon" sizes="180x180" href="/Asset/apple-touch-icon.png?v=4" />
        <link rel="manifest" href="/site.webmanifest?v=4" />
        <meta name="msapplication-config" content="/browserconfig.xml?v=4" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
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
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <ConsoleSilencer />
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
