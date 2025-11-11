"use client";
import React, { useState } from "react";

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    // Di production, kirim ke API di sini
  }

  return (
    <div className="min-h-screen bg-duniacrypto-bg-darker">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300">Kami siap membantu menjawab pertanyaan Anda</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Information */}
          <div className="bg-duniacrypto-panel p-8 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Informasi Kontak</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Email</h3>
                <p>
                  <a href="mailto:info@beluga.id" className="text-blue-400 hover:text-blue-300 transition">
                    info@beluga.id
                  </a>
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Alamat</h3>
                <p>Jakarta, Indonesia</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Jam Operasional</h3>
                <p>Senin - Jumat: 09:00 - 18:00 WIB</p>
                <p>Sabtu - Minggu: 10:00 - 16:00 WIB</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-duniacrypto-panel p-8 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Kirim Pesan</h2>
            {sent ? (
              <div className="p-4 bg-green-900/30 text-green-300 rounded-lg mb-4 border border-green-700">
                Terima kasih! Pesan Anda telah terkirim. Kami akan merespons secepat mungkin.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium text-white" htmlFor="name">
                    Nama
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-duniacrypto-bg-darker text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-white" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-duniacrypto-bg-darker text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-white" htmlFor="message">
                    Pesan
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-duniacrypto-bg-darker text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    id="message"
                    name="message"
                    autoComplete="off"
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Kirim Pesan
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-duniacrypto-panel p-8 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-6">Mengapa Menghubungi Kami?</h2>
          <div className="grid gap-6 md:grid-cols-3 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Pertanyaan Umum</h3>
              <p className="text-sm leading-relaxed">
                Ada pertanyaan tentang cryptocurrency, blockchain, atau platform Beluga? Tim kami siap membantu.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Kolaborasi</h3>
              <p className="text-sm leading-relaxed">
                Tertarik untuk berkolaborasi atau menjadi kontributor? Mari diskusikan peluangnya bersama.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Laporan Masalah</h3>
              <p className="text-sm leading-relaxed">
                Menemukan bug atau masalah teknis? Laporkan kepada kami agar kami dapat memperbaikinya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

