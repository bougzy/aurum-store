import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
                <span className="text-dark-900 font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold gold-text">AurumStore</span>
            </div>
            <p className="text-[#f5f0e1]/50 text-sm max-w-md">
              The premium platform for gold commerce. Create your own luxury gold store in minutes and start selling to customers worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-gold-400 font-semibold mb-4">Platform</h4>
            <div className="space-y-2">
              <Link href="/#how-it-works" className="block text-sm text-[#f5f0e1]/50 hover:text-gold-400 transition-colors">How it Works</Link>
              <Link href="/#pricing" className="block text-sm text-[#f5f0e1]/50 hover:text-gold-400 transition-colors">Pricing</Link>
              <Link href="/auth/register" className="block text-sm text-[#f5f0e1]/50 hover:text-gold-400 transition-colors">Create Store</Link>
            </div>
          </div>
          <div>
            <h4 className="text-gold-400 font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              <Link href="/auth/login" className="block text-sm text-[#f5f0e1]/50 hover:text-gold-400 transition-colors">Login</Link>
              <span className="block text-sm text-[#f5f0e1]/50">Contact Us</span>
            </div>
          </div>
        </div>
        <div className="border-t border-dark-700 mt-8 pt-8 text-center text-sm text-[#f5f0e1]/30">
          &copy; {new Date().getFullYear()} AurumStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
