export default function Footer() {
  return (
    <footer className="w-full bg-duniacrypto-panel text-gray-400 text-center py-4 border-t border-gray-800 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Dunia Crypto. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 