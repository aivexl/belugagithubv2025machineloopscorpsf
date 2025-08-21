import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-duniacrypto-bg-darker text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">✅ Next.js is Working!</h1>
        <p className="text-xl text-gray-300">Your DuniaCrypto application is running successfully.</p>
        <div className="mt-8">
          <Link 
            href="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 