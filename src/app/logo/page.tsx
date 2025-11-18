"use client";

import Image from "next/image";
import { useState } from "react";

export default function LogoPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadLogo = async (logoPath: string, filename: string) => {
    setDownloading(filename);
    try {
      const response = await fetch(logoPath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading logo:", error);
      alert("Gagal mengunduh logo. Silakan coba lagi.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-duniacrypto-bg-darker py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Beluga Logo</h1>
          <p className="text-gray-300">Download logo Beluga dalam format PNG</p>
        </div>

        <div className="bg-duniacrypto-panel p-8 rounded-lg shadow-lg border border-gray-700">
          <div className="bg-duniacrypto-bg-darker p-6 rounded-lg mb-6 flex items-center justify-center min-h-[400px]">
            <Image
              src="/Asset/belugalogov3white.png"
              alt="Beluga Logo Putih"
              width={669}
              height={514}
              priority
              className="max-w-full h-auto"
            />
          </div>
          <button
            onClick={() => downloadLogo("/Asset/belugalogov3white.png", "belugalogov3white.png")}
            disabled={downloading === "belugalogov3white.png"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading === "belugalogov3white.png" ? "Mengunduh..." : "Download PNG"}
          </button>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Format: PNG | Ukuran asli: 669 x 514 pixels</p>
        </div>
      </div>
    </div>
  );
}

