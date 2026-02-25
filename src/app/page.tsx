import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import PlatformChatbot from '@/components/chat/PlatformChatbot';

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <main className="pt-16">
        {/* ========== HERO ========== */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          {/* Background ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Copy */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5 mb-8">
                  <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                  <span className="text-sm text-gold-400 font-medium">Premium Gold Commerce Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="gold-text">Launch Your</span>
                  <br />
                  <span className="gold-text">Premium Gold</span>
                  <br />
                  <span className="gold-text">Store</span>
                </h1>

                <p className="text-lg sm:text-xl text-[#f5f0e1]/60 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
                  Create a stunning, luxury gold e-commerce store in minutes.
                  Accept Bitcoin payments, chat with customers in real-time,
                  and manage everything from one elegant dashboard.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/auth/register">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto text-base">
                      Get Started Free
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Button>
                  </Link>
                  <Link href="/#how-it-works">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                      See How It Works
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-8 mt-10 justify-center lg:justify-start text-sm text-[#f5f0e1]/40">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    No credit card required
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Setup in 2 minutes
                  </div>
                </div>
              </div>

              {/* Right: Decorative gold ring / diamond SVG animation */}
              <div className="hidden lg:flex items-center justify-center relative">
                <div className="relative w-96 h-96">
                  {/* Outer rotating ring */}
                  <svg
                    className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]"
                    viewBox="0 0 400 400"
                    fill="none"
                  >
                    <circle
                      cx="200"
                      cy="200"
                      r="180"
                      stroke="url(#goldRingGrad1)"
                      strokeWidth="1.5"
                      strokeDasharray="8 12"
                      opacity="0.4"
                    />
                    <defs>
                      <linearGradient id="goldRingGrad1" x1="0" y1="0" x2="400" y2="400">
                        <stop offset="0%" stopColor="#d4a017" />
                        <stop offset="50%" stopColor="#f3d98a" />
                        <stop offset="100%" stopColor="#d4a017" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Middle ring */}
                  <svg
                    className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite_reverse]"
                    viewBox="0 0 400 400"
                    fill="none"
                  >
                    <circle
                      cx="200"
                      cy="200"
                      r="150"
                      stroke="url(#goldRingGrad2)"
                      strokeWidth="2"
                      opacity="0.3"
                    />
                    <circle
                      cx="200"
                      cy="50"
                      r="6"
                      fill="#d4a017"
                      opacity="0.8"
                    />
                    <circle
                      cx="200"
                      cy="350"
                      r="4"
                      fill="#f3d98a"
                      opacity="0.6"
                    />
                    <defs>
                      <linearGradient id="goldRingGrad2" x1="0" y1="0" x2="400" y2="400">
                        <stop offset="0%" stopColor="#f3d98a" />
                        <stop offset="100%" stopColor="#b8860b" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Inner glowing ring */}
                  <svg
                    className="absolute inset-0 w-full h-full animate-[spin_25s_linear_infinite]"
                    viewBox="0 0 400 400"
                    fill="none"
                  >
                    <circle
                      cx="200"
                      cy="200"
                      r="110"
                      stroke="#d4a017"
                      strokeWidth="1"
                      strokeDasharray="4 8"
                      opacity="0.5"
                    />
                  </svg>

                  {/* Center diamond */}
                  <div className="absolute inset-0 flex items-center justify-center float-animation">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                      {/* Diamond shape */}
                      <polygon
                        points="60,5 110,45 90,115 30,115 10,45"
                        fill="url(#diamondFill)"
                        stroke="url(#diamondStroke)"
                        strokeWidth="1.5"
                        opacity="0.9"
                      />
                      {/* Inner facets */}
                      <line x1="60" y1="5" x2="60" y2="115" stroke="#f3d98a" strokeWidth="0.5" opacity="0.3" />
                      <line x1="10" y1="45" x2="110" y2="45" stroke="#f3d98a" strokeWidth="0.5" opacity="0.3" />
                      <line x1="60" y1="5" x2="30" y2="115" stroke="#f3d98a" strokeWidth="0.5" opacity="0.15" />
                      <line x1="60" y1="5" x2="90" y2="115" stroke="#f3d98a" strokeWidth="0.5" opacity="0.15" />
                      <line x1="10" y1="45" x2="60" y2="115" stroke="#f3d98a" strokeWidth="0.5" opacity="0.2" />
                      <line x1="110" y1="45" x2="60" y2="115" stroke="#f3d98a" strokeWidth="0.5" opacity="0.2" />
                      <defs>
                        <linearGradient id="diamondFill" x1="20" y1="10" x2="100" y2="110">
                          <stop offset="0%" stopColor="#d4a017" stopOpacity="0.15" />
                          <stop offset="50%" stopColor="#f3d98a" stopOpacity="0.08" />
                          <stop offset="100%" stopColor="#b8860b" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="diamondStroke" x1="10" y1="5" x2="110" y2="115">
                          <stop offset="0%" stopColor="#f3d98a" />
                          <stop offset="50%" stopColor="#d4a017" />
                          <stop offset="100%" stopColor="#f3d98a" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 rounded-full shimmer opacity-40" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== HOW IT WORKS ========== */}
        <section id="how-it-works" className="relative py-24 lg:py-32">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold gold-text mb-4">
                How It Works
              </h2>
              <p className="text-[#f5f0e1]/50 text-lg max-w-2xl mx-auto">
                Get your premium gold store up and running in three simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative group">
                <div className="bg-dark-800 border border-gold-500/10 rounded-2xl p-8 text-center hover:border-gold-500/30 transition-all duration-300 h-full">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gold-500/10 mb-6">
                    <svg className="w-8 h-8 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full gold-gradient flex items-center justify-center text-dark-900 text-xs font-bold">
                      1
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#f5f0e1] mb-3">Create Account</h3>
                  <p className="text-[#f5f0e1]/50 leading-relaxed">
                    Sign up in seconds and choose your unique store name. Your premium storefront is instantly generated with a gold-themed design.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="bg-dark-800 border border-gold-500/10 rounded-2xl p-8 text-center hover:border-gold-500/30 transition-all duration-300 h-full">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gold-500/10 mb-6">
                    <svg className="w-8 h-8 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full gold-gradient flex items-center justify-center text-dark-900 text-xs font-bold">
                      2
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#f5f0e1] mb-3">Add Products</h3>
                  <p className="text-[#f5f0e1]/50 leading-relaxed">
                    Upload your gold products with photos, descriptions, and pricing. Organize them into categories for a seamless shopping experience.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="bg-dark-800 border border-gold-500/10 rounded-2xl p-8 text-center hover:border-gold-500/30 transition-all duration-300 h-full">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gold-500/10 mb-6">
                    <svg className="w-8 h-8 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full gold-gradient flex items-center justify-center text-dark-900 text-xs font-bold">
                      3
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#f5f0e1] mb-3">Start Selling</h3>
                  <p className="text-[#f5f0e1]/50 leading-relaxed">
                    Share your store link, accept Bitcoin payments, and manage orders with our intuitive dashboard. Start earning from day one.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== FEATURES ========== */}
        <section className="relative py-24 lg:py-32 bg-dark-800/50">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold gold-text mb-4">
                Powerful Features
              </h2>
              <p className="text-[#f5f0e1]/50 text-lg max-w-2xl mx-auto">
                Everything you need to run a world-class gold commerce business, built into one platform.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1: Multi-Tenant Stores */}
              <div className="bg-dark-800 border border-gold-500/10 rounded-2xl p-6 hover:border-gold-500/25 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 group-hover:bg-gold-500/15 transition-colors">
                  <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#f5f0e1] mb-2">Multi-Tenant Stores</h3>
                <p className="text-[#f5f0e1]/45 text-sm leading-relaxed">
                  Each seller gets their own branded storefront with a unique URL. Fully isolated data and customizable store settings.
                </p>
              </div>

              {/* Feature 2: Bitcoin Payments */}
              <div className="bg-dark-800 border border-gold-500/10 rounded-2xl p-6 hover:border-gold-500/25 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 group-hover:bg-gold-500/15 transition-colors">
                  <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 0v4m0-4h4m-4 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h2.5c.828 0 1.5-.448 1.5-1s-.672-1-1.5-1H9v4h3c.828 0 1.5-.448 1.5-1s-.672-1-1.5-1H9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#f5f0e1] mb-2">Bitcoin Payments</h3>
                <p className="text-[#f5f0e1]/45 text-sm leading-relaxed">
                  Accept Bitcoin payments seamlessly with integrated wallet support. Secure, borderless transactions for the modern gold trade.
                </p>
              </div>

              {/* Feature 3: Real-Time Chat */}
              <div className="bg-dark-800 border border-gold-500/10 rounded-2xl p-6 hover:border-gold-500/25 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 group-hover:bg-gold-500/15 transition-colors">
                  <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#f5f0e1] mb-2">Real-Time Chat</h3>
                <p className="text-[#f5f0e1]/45 text-sm leading-relaxed">
                  Built-in live chat lets buyers and sellers communicate instantly. Negotiate deals and answer questions in real time.
                </p>
              </div>

              {/* Feature 4: Product Management */}
              <div className="bg-dark-800 border border-gold-500/10 rounded-2xl p-6 hover:border-gold-500/25 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 group-hover:bg-gold-500/15 transition-colors">
                  <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#f5f0e1] mb-2">Product Management</h3>
                <p className="text-[#f5f0e1]/45 text-sm leading-relaxed">
                  Effortlessly manage your entire product catalog. Add images, set prices, organize categories, and track inventory with ease.
                </p>
              </div>

              {/* Feature 5: Order Tracking */}
              <div className="bg-dark-800 border border-gold-500/10 rounded-2xl p-6 hover:border-gold-500/25 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 group-hover:bg-gold-500/15 transition-colors">
                  <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#f5f0e1] mb-2">Order Tracking</h3>
                <p className="text-[#f5f0e1]/45 text-sm leading-relaxed">
                  Full order lifecycle management from placement to delivery. Both buyers and sellers get real-time status updates on every transaction.
                </p>
              </div>

              {/* Feature 6: WhatsApp Integration */}
              <div className="bg-dark-800 border border-gold-500/10 rounded-2xl p-6 hover:border-gold-500/25 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 group-hover:bg-gold-500/15 transition-colors">
                  <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#f5f0e1] mb-2">WhatsApp Integration</h3>
                <p className="text-[#f5f0e1]/45 text-sm leading-relaxed">
                  Connect your WhatsApp number so customers can reach you directly. One-click messaging for faster deal closings and support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== WHY CHOOSE US ========== */}
        <section className="relative py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold gold-text mb-4">
                Why Choose AurumStore
              </h2>
              <p className="text-[#f5f0e1]/50 text-lg max-w-2xl mx-auto">
                Built for serious gold merchants who demand excellence.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Selling Point 1 */}
              <div className="relative bg-dark-800 border border-gold-500/10 rounded-2xl p-8 overflow-hidden group hover:border-gold-500/30 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 gold-gradient opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#f5f0e1] mb-3">Enterprise-Grade Security</h3>
                <p className="text-[#f5f0e1]/45 leading-relaxed">
                  Your store is protected with industry-leading security measures. Encrypted transactions, secure authentication, and isolated tenant data ensure your business and customer information stays safe.
                </p>
              </div>

              {/* Selling Point 2 */}
              <div className="relative bg-dark-800 border border-gold-500/10 rounded-2xl p-8 overflow-hidden group hover:border-gold-500/30 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 gold-gradient opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#f5f0e1] mb-3">Lightning-Fast Performance</h3>
                <p className="text-[#f5f0e1]/45 leading-relaxed">
                  Built on cutting-edge technology for blazing-fast load times. Your customers enjoy a smooth, responsive shopping experience that keeps them coming back for more.
                </p>
              </div>

              {/* Selling Point 3 */}
              <div className="relative bg-dark-800 border border-gold-500/10 rounded-2xl p-8 overflow-hidden group hover:border-gold-500/30 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 gold-gradient opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#f5f0e1] mb-3">Premium Design Language</h3>
                <p className="text-[#f5f0e1]/45 leading-relaxed">
                  Every storefront radiates luxury with our signature black and gold aesthetic. Your products deserve a showcase that matches their value and prestige.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== PRICING ========== */}
        <section id="pricing" className="relative py-24 lg:py-32 bg-dark-800/50">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold gold-text mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-[#f5f0e1]/50 text-lg max-w-2xl mx-auto">
                One plan, everything included. No hidden fees, no surprises.
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              <div className="relative bg-dark-800 border border-gold-500/20 rounded-2xl overflow-hidden">
                {/* Top accent bar */}
                <div className="h-1.5 gold-gradient" />

                <div className="p-8 sm:p-10">
                  {/* Plan badge */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-[#f5f0e1]">Gold Standard</h3>
                      <p className="text-[#f5f0e1]/40 text-sm mt-1">Everything you need to succeed</p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/20">
                      <svg className="w-6 h-6 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold gold-text">Free</span>
                    </div>
                    <p className="text-[#f5f0e1]/40 text-sm mt-2">Free forever. Start selling today.</p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gold-500/10 mb-8" />

                  {/* Features list */}
                  <ul className="space-y-4 mb-10">
                    {[
                      'Unlimited products',
                      'Bitcoin payment integration',
                      'Real-time customer chat',
                      'Custom store branding',
                      'Order management dashboard',
                      'WhatsApp integration',
                      'Product image uploads',
                      'Mobile-responsive storefront',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-[#f5f0e1]/70 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/auth/register" className="block">
                    <Button variant="primary" size="lg" className="w-full text-base">
                      Get Started Free
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== FINAL CTA ========== */}
        <section className="relative py-24 lg:py-32">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[100px]" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gold-text mb-6">
              Ready to Start Your Gold Empire?
            </h2>
            <p className="text-lg sm:text-xl text-[#f5f0e1]/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join the next generation of gold merchants. Create your premium store today
              and start reaching customers around the world.
            </p>
            <Link href="/auth/register">
              <Button variant="primary" size="lg" className="text-base px-10">
                Create Your Store Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <p className="text-[#f5f0e1]/30 text-sm mt-6">
              Free forever &middot; No credit card needed &middot; Takes 2 minutes
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <PlatformChatbot />
    </div>
  );
}
