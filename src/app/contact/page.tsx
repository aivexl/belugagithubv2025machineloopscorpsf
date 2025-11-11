import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us - Beluga Crypto Indonesia",
  description: "Hubungi tim Beluga untuk pertanyaan, saran, atau kolaborasi. Kami siap membantu Anda dengan informasi cryptocurrency dan blockchain.",
  keywords: "contact, beluga, crypto indonesia, hubungi kami, support",
  openGraph: {
    title: "Contact Us - Beluga Crypto Indonesia",
    description: "Hubungi tim Beluga untuk pertanyaan, saran, atau kolaborasi.",
    url: "https://beluga.id/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
