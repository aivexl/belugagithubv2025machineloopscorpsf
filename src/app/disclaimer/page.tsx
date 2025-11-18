import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer - Beluga Crypto Indonesia",
  description: "Disclaimer untuk penggunaan platform Beluga dan informasi cryptocurrency.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-duniacrypto-bg-darker">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Disclaimer</h1>
          <p className="text-xl text-gray-300">Informasi penting sebelum menggunakan platform Beluga</p>
        </div>
        
        <div className="bg-duniacrypto-panel p-8 rounded-lg shadow-lg border border-gray-700">
          <div className="text-gray-300 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Informasi Umum</h2>
              <p>
                Platform Beluga menyediakan informasi dan edukasi seputar cryptocurrency, blockchain, dan teknologi terkait. 
                Semua informasi yang disajikan di platform ini adalah untuk tujuan edukasi dan informasi umum saja.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Bukan Saran Finansial</h2>
              <p>
                Informasi yang disediakan di platform Beluga bukan merupakan saran investasi, rekomendasi keuangan, 
                atau ajakan untuk membeli, menjual, atau memegang aset cryptocurrency tertentu. Semua keputusan investasi 
                sepenuhnya menjadi tanggung jawab pengguna.
              </p>
              <p className="mt-4">
                Kami sangat menyarankan Anda untuk berkonsultasi dengan penasihat keuangan yang berkualifikasi sebelum 
                membuat keputusan investasi apa pun.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Risiko Investasi</h2>
              <p>
                Investasi dalam cryptocurrency memiliki risiko yang sangat tinggi. Nilai aset cryptocurrency dapat berfluktuasi 
                secara drastis dan dapat mengakibatkan kerugian sebagian atau seluruh investasi Anda. Pastikan Anda memahami 
                risiko yang terlibat sebelum berinvestasi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Akurasi Informasi</h2>
              <p>
                Meskipun kami berusaha untuk menyediakan informasi yang akurat dan terkini, kami tidak memberikan jaminan 
                atau pernyataan apa pun mengenai kelengkapan, keakuratan, atau keandalan informasi yang disajikan. Informasi 
                dapat berubah tanpa pemberitahuan sebelumnya.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Tautan Eksternal</h2>
              <p>
                Platform kami mungkin berisi tautan ke situs web pihak ketiga. Kami tidak bertanggung jawab atas konten, 
                kebijakan privasi, atau praktik situs web pihak ketiga tersebut.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Perubahan Disclaimer</h2>
              <p>
                Kami berhak untuk memodifikasi atau memperbarui disclaimer ini kapan saja tanpa pemberitahuan sebelumnya. 
                Pengguna diharapkan untuk secara berkala meninjau halaman ini untuk setiap perubahan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Kontak</h2>
              <p>
                Jika Anda memiliki pertanyaan tentang disclaimer ini, silakan hubungi kami melalui halaman kontak yang tersedia 
                di platform.
              </p>
            </section>

            <div className="pt-6 mt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}














