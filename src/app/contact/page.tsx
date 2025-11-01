"use client";
import React, { useState, useEffect } from "react";

export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact Us - Beluga Crypto Indonesia";
  }, []);
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
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="mb-8 bg-duniacrypto-panel p-6 rounded-lg shadow">
        <p className="mb-2">Email: <a href="mailto:info@beluga.id" className="text-blue-400">info@beluga.id</a></p>
        <p>Address: Jakarta, Indonesia</p>
      </div>
      <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
      {sent ? (
        <div className="p-4 bg-green-100 text-green-800 rounded mb-4">Thank you! Your message has been sent.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-duniacrypto-panel p-6 rounded-lg shadow">
          <div>
            <label className="block mb-1 font-medium" htmlFor="name">Name</label>
            <input
              className="w-full px-3 py-2 rounded border border-gray-700 bg-duniacrypto-bg-darker text-white"
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
            <label className="block mb-1 font-medium" htmlFor="email">Email</label>
            <input
              className="w-full px-3 py-2 rounded border border-gray-700 bg-duniacrypto-bg-darker text-white"
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
            <label className="block mb-1 font-medium" htmlFor="message">Message</label>
            <textarea
              className="w-full px-3 py-2 rounded border border-gray-700 bg-duniacrypto-bg-darker text-white"
              id="message"
              name="message"
              autoComplete="off"
              rows={4}
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
} 