import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beluga Logo - Download PNG",
  description: "Download logo Beluga dalam format PNG - Platform Crypto Indonesia Terdepan",
};

export default function LogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


