import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-duniacrypto-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-duniacrypto-panel border border-gray-700 rounded-lg p-8 shadow-xl">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-white mb-2">Page Not Found</h2>
            <p className="text-gray-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Go to Home
            </Link>
            
            <Link 
              href="/profile"
              className="block w-full bg-gray-700 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200"
            >
              Go to Profile
            </Link>
            
            <Link 
              href="/"
              className="block w-full bg-gray-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-500 transition-all duration-200"
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 