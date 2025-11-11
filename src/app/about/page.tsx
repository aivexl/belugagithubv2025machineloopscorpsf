import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Beluga Crypto Indonesia",
  description: "Pelajari lebih lanjut tentang Beluga, platform cryptocurrency Indonesia terdepan yang menghadirkan informasi dan edukasi terbaik.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-duniacrypto-bg-darker">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">About Beluga</h1>
          <p className="text-xl text-gray-300">Platform edukasi dan informasi cryptocurrency terdepan di Indonesia</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Visi & Misi */}
          <div className="bg-duniacrypto-panel p-8 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Visi & Misi</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-400 mb-3">Visi</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Meningkatkan literasi dan pemahaman masyarakat tentang teknologi blockchain dan aset kripto.</li>
                <li>Menjadi sumber informasi terpercaya dan terdepan di bidang crypto di Indonesia.</li>
                <li>Mendorong adopsi teknologi blockchain secara positif dan bertanggung jawab.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-3">Misi</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Menyediakan konten edukasi yang mudah dipahami dan up-to-date.</li>
                <li>Membangun komunitas yang aktif, inklusif, dan suportif.</li>
                <li>Mendorong adopsi teknologi blockchain secara positif dan bertanggung jawab.</li>
                <li>Menyediakan platform yang aman dan terpercaya untuk informasi crypto.</li>
              </ul>
            </div>
          </div>
          
          {/* Info Singkat */}
          <div className="bg-duniacrypto-panel p-8 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Info Singkat</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Didirikan</h3>
                <p className="text-gray-300">Tahun 2024</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Fokus</h3>
                <p className="text-gray-300">Edukasi cryptocurrency, blockchain, dan web3 untuk masyarakat Indonesia</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Komitmen</h3>
                <p className="text-gray-300">Menjadi jembatan antara teknologi baru dan masyarakat luas dengan pendekatan yang bertanggung jawab</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Platform</h3>
                <p className="text-gray-300">Website, aplikasi mobile, dan komunitas online yang terintegrasi</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Deskripsi Lengkap */}
        <div className="mt-12 bg-duniacrypto-panel p-8 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-6">Tentang Kami</h2>
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              Beluga adalah platform edukasi dan informasi seputar dunia cryptocurrency, blockchain, dan web3 
              yang didedikasikan untuk masyarakat Indonesia. Kami memahami bahwa teknologi blockchain dan cryptocurrency 
              masih relatif baru di Indonesia, sehingga kami berkomitmen untuk menyediakan informasi yang akurat, 
              mudah dipahami, dan selalu up-to-date.
            </p>
            <p>
              Platform kami dirancang dengan mempertimbangkan kebutuhan berbagai kalangan, dari pemula yang baru 
              mengenal cryptocurrency hingga investor yang sudah berpengalaman. Kami menyediakan berbagai jenis konten, 
              mulai dari artikel edukasi dasar hingga analisis mendalam tentang tren pasar dan teknologi terbaru.
            </p>
            <p>
              Selain menyediakan informasi, kami juga aktif membangun komunitas yang inklusif dan suportif. 
              Melalui berbagai platform dan event, kami mendorong diskusi yang sehat dan bertanggung jawab 
              tentang cryptocurrency dan blockchain technology.
            </p>
            <p>
              Keamanan dan kepercayaan adalah prioritas utama kami. Semua informasi yang kami sajikan 
              telah melalui proses verifikasi dan review yang ketat untuk memastikan akurasi dan relevansi 
              dengan kondisi pasar dan regulasi yang berlaku di Indonesia.
            </p>
            <p>
              Beluga menyediakan berbagai fitur lengkap untuk membantu pengguna memahami dunia cryptocurrency dengan lebih baik. 
              Kami menyediakan berita terkini seputar pasar crypto, analisis mendalam tentang berbagai aset digital, 
              informasi tentang exchange dan platform trading, serta panduan edukasi yang komprehensif untuk pemula 
              maupun investor berpengalaman.
            </p>
            <p>
              Tim Beluga terdiri dari para ahli di bidang blockchain, cryptocurrency, dan teknologi finansial yang memiliki 
              pengalaman bertahun-tahun. Kami terus mengikuti perkembangan terbaru di industri crypto untuk memastikan 
              bahwa konten yang kami sajikan selalu relevan dan akurat sesuai dengan kondisi pasar terkini.
            </p>
            <p>
              Komitmen kami adalah memberikan informasi yang dapat diandalkan dan membantu masyarakat Indonesia 
              untuk memahami dan berpartisipasi dalam ekosistem cryptocurrency dengan cara yang aman dan bertanggung jawab. 
              Kami percaya bahwa edukasi yang tepat adalah kunci untuk adopsi teknologi blockchain yang sukses di Indonesia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 