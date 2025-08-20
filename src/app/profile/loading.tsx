export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-duniacrypto-background pt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Loading Profile...</h2>
        <p className="text-gray-400">Please wait while we load your profile information.</p>
      </div>
    </div>
  );
}
