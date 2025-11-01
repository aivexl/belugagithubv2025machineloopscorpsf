import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-duniacrypto-panel text-gray-400 py-4 border-t border-gray-800 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Dunia Crypto. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link 
              href="/disclaimer" 
              className="text-gray-400 hover:text-white transition-colors duration-200 no-underline hover:no-underline"
            >
              Disclaimer
            </Link>
            <Link 
              href="/privacy-policy" 
              className="text-gray-400 hover:text-white transition-colors duration-200 no-underline hover:no-underline"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms-of-use" 
              className="text-gray-400 hover:text-white transition-colors duration-200 no-underline hover:no-underline"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 