import { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Sanity Studio - Beluga Crypto CMS',
  description: 'Content management system for Beluga Crypto platform',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}