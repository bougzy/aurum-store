import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import PWARegister from '@/components/PWARegister';
import './globals.css';

export const metadata: Metadata = {
  title: 'AurumStore - Premium Gold E-Commerce Platform',
  description: 'Create your own luxury gold store. Buy and sell premium gold products with ease.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-512.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-dark-900 text-[#f5f0e1]">
        <AuthProvider>
          <CartProvider>
            {children}
            <PWARegister />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1a1a1a',
                  color: '#f5f0e1',
                  border: '1px solid rgba(212, 160, 23, 0.3)',
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
