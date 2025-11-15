import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use - Beluga Crypto Indonesia",
  description: "Syarat dan ketentuan penggunaan platform Beluga.",
};

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-duniacrypto-bg-darker">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Use</h1>
          <p className="text-xl text-gray-300">Syarat dan Ketentuan Penggunaan Platform Beluga</p>
        </div>
        
        <div className="bg-duniacrypto-panel p-8 rounded-lg shadow-lg border border-gray-700">
          <div className="text-gray-300 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Penerimaan Syarat</h2>
              <p>
                Dengan mengakses dan menggunakan platform Beluga, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. 
                Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak boleh menggunakan platform kami.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Penggunaan Platform</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Kewajiban Pengguna</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Menyediakan informasi yang akurat dan terkini saat mendaftar</li>
                    <li>Menjaga kerahasiaan informasi akun Anda</li>
                    <li>Menggunakan platform sesuai dengan tujuan yang dimaksudkan</li>
                    <li>Mematuhi semua hukum dan regulasi yang berlaku</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Larangan</h3>
                  <p>Anda dilarang untuk:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Menggunakan platform untuk tujuan ilegal atau tidak sah</li>
                    <li>Mencoba mengakses area terbatas atau sistem backend platform</li>
                    <li>Mengganggu atau mengganggu operasi platform</li>
                    <li>Menyebarkan malware, virus, atau kode berbahaya lainnya</li>
                    <li>Menggunakan robot, scraper, atau metode otomatis untuk mengakses platform tanpa izin</li>
                    <li>Menyalin, memodifikasi, atau mendistribusikan konten platform tanpa izin</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Hak Kekayaan Intelektual</h2>
              <p>
                Semua konten di platform Beluga, termasuk tetapi tidak terbatas pada teks, grafik, logo, gambar, dan perangkat lunak, 
                adalah milik Beluga atau pemberi lisensinya dan dilindungi oleh undang-undang hak cipta dan kekayaan intelektual.
              </p>
              <p className="mt-4">
                Anda tidak diperbolehkan untuk mereproduksi, mendistribusikan, memodifikasi, atau membuat karya turunan dari 
                konten platform tanpa izin tertulis dari Beluga.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Akun Pengguna</h2>
              <p>
                Saat membuat akun di platform Beluga, Anda bertanggung jawab untuk:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Memelihara keamanan kata sandi dan informasi akun Anda</li>
                <li>Segera memberi tahu kami tentang penggunaan tidak sah atas akun Anda</li>
                <li>Memastikan bahwa semua informasi yang Anda berikan akurat dan terkini</li>
                <li>Bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Konten Pengguna</h2>
              <p>
                Jika Anda mengirimkan konten ke platform (seperti komentar, posting, atau materi lainnya), Anda memberikan 
                Beluga lisensi untuk menggunakan, menampilkan, dan mendistribusikan konten tersebut di platform.
              </p>
              <p className="mt-4">
                Anda bertanggung jawab untuk memastikan bahwa konten yang Anda kirim tidak melanggar hak pihak ketiga atau 
                hukum yang berlaku.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Penyangkalan</h2>
              <p>
                Platform Beluga disediakan "sebagaimana adanya" tanpa jaminan apa pun. Kami tidak menjamin bahwa:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Platform akan selalu tersedia atau bebas dari kesalahan</li>
                <li>Informasi yang disajikan akurat, lengkap, atau terkini</li>
                <li>Platform akan memenuhi kebutuhan atau harapan Anda</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Batasan Tanggung Jawab</h2>
              <p>
                Dalam batas maksimum yang diizinkan oleh hukum, Beluga tidak akan bertanggung jawab atas kerugian langsung, 
                tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan 
                platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Pembatalan dan Penangguhan</h2>
              <p>
                Kami berhak untuk menangguhkan atau membatalkan akses Anda ke platform, dengan atau tanpa pemberitahuan, 
                karena pelanggaran syarat dan ketentuan ini atau karena alasan lain yang kami anggap perlu.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Perubahan Syarat</h2>
              <p>
                Kami berhak untuk memodifikasi syarat dan ketentuan ini kapan saja. Perubahan akan dipublikasikan di halaman 
                ini dan akan berlaku efektif segera setelah dipublikasikan. Penggunaan berkelanjutan platform setelah perubahan 
                berarti Anda menerima syarat yang diperbarui.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Hukum yang Berlaku</h2>
              <p>
                Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa 
                yang timbul dari atau terkait dengan syarat ini akan diselesaikan melalui pengadilan yang berwenang di Indonesia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Kontak</h2>
              <p>
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami melalui halaman kontak 
                yang tersedia di platform.
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











