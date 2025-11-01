import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Beluga Crypto Indonesia",
  description: "Kebijakan privasi untuk platform Beluga dan bagaimana kami melindungi data pengguna.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-duniacrypto-bg-darker">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-300">Kebijakan Privasi Beluga</p>
        </div>
        
        <div className="bg-duniacrypto-panel p-8 rounded-lg shadow-lg border border-gray-700">
          <div className="text-gray-300 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Pengenalan</h2>
              <p>
                Beluga menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan privasi ini 
                menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda saat menggunakan 
                platform Beluga.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Informasi yang Kami Kumpulkan</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Informasi yang Anda Berikan</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Nama dan informasi kontak saat mendaftar</li>
                    <li>Alamat email dan kata sandi</li>
                    <li>Informasi profil lainnya yang Anda pilih untuk dibagikan</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Informasi yang Otomatis Dikumpulkan</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Alamat IP dan informasi perangkat</li>
                    <li>Data penggunaan platform (halaman yang dikunjungi, waktu kunjungan)</li>
                    <li>Cookie dan teknologi pelacakan serupa</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Bagaimana Kami Menggunakan Informasi</h2>
              <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Menyediakan, memelihara, dan meningkatkan layanan platform</li>
                <li>Memproses transaksi dan mengelola akun Anda</li>
                <li>Mengirim notifikasi dan komunikasi terkait layanan</li>
                <li>Menganalisis penggunaan platform untuk meningkatkan pengalaman pengguna</li>
                <li>Mendeteksi dan mencegah aktivitas penipuan atau ilegal</li>
                <li>Mematuhi kewajiban hukum dan regulasi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Berbagi Informasi</h2>
              <p>
                Kami tidak menjual data pribadi Anda. Kami mungkin membagikan informasi Anda dalam situasi berikut:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Dengan penyedia layanan pihak ketiga yang membantu operasi platform kami</li>
                <li>Ketika diperlukan oleh hukum atau proses hukum</li>
                <li>Untuk melindungi hak, properti, atau keamanan Beluga dan pengguna kami</li>
                <li>Dengan persetujuan Anda atau sesuai instruksi Anda</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Keamanan Data</h2>
              <p>
                Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar untuk melindungi data pribadi Anda 
                dari akses tidak sah, pengungkapan, perubahan, atau penghancuran. Namun, tidak ada metode transmisi melalui 
                internet atau penyimpanan elektronik yang 100% aman.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Cookie dan Teknologi Pelacakan</h2>
              <p>
                Kami menggunakan cookie dan teknologi pelacakan serupa untuk meningkatkan pengalaman Anda, menganalisis penggunaan 
                platform, dan menyediakan konten yang dipersonalisasi. Anda dapat mengontrol penggunaan cookie melalui pengaturan 
                browser Anda.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Hak Anda</h2>
              <p>Anda memiliki hak untuk:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Mengakses data pribadi Anda</li>
                <li>Memperbarui atau memperbaiki data pribadi Anda</li>
                <li>Meminta penghapusan data pribadi Anda</li>
                <li>Menolak pemrosesan data pribadi Anda dalam kondisi tertentu</li>
                <li>Mengajukan keluhan kepada otoritas perlindungan data yang berwenang</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Perubahan Kebijakan Privasi</h2>
              <p>
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan dipublikasikan di halaman ini 
                dengan tanggal "Terakhir diperbarui" yang diperbarui. Kami menyarankan Anda untuk meninjau kebijakan ini secara 
                berkala.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Kontak</h2>
              <p>
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau praktik privasi kami, silakan hubungi kami 
                melalui halaman kontak yang tersedia di platform.
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



