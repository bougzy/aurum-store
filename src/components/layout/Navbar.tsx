'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
              <span className="text-dark-900 font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold gold-text">AurumStore</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" className="text-sm text-[#f5f0e1]/70 hover:text-gold-400 transition-colors">
              How it Works
            </Link>
            <Link href="/#pricing" className="text-sm text-[#f5f0e1]/70 hover:text-gold-400 transition-colors">
              Pricing
            </Link>
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    {user.role === 'admin' ? (
                      <Link href="/admin">
                        <Button variant="secondary" size="sm">Admin Panel</Button>
                      </Link>
                    ) : (
                      <Link href="/dashboard">
                        <Button variant="secondary" size="sm">Dashboard</Button>
                      </Link>
                    )}
                    <button onClick={logout} className="text-sm text-[#f5f0e1]/70 hover:text-red-400 transition-colors">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button variant="primary" size="sm">Create Store</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-gold-400" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-dark-700 space-y-3">
            <Link href="/#how-it-works" className="block text-sm text-[#f5f0e1]/70 hover:text-gold-400" onClick={() => setMenuOpen(false)}>
              How it Works
            </Link>
            <Link href="/#pricing" className="block text-sm text-[#f5f0e1]/70 hover:text-gold-400" onClick={() => setMenuOpen(false)}>
              Pricing
            </Link>
            {!loading && !user && (
              <div className="flex gap-3 pt-2">
                <Link href="/auth/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link href="/auth/register"><Button variant="primary" size="sm">Create Store</Button></Link>
              </div>
            )}
            {!loading && user && (
              <div className="space-y-2 pt-2">
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}>
                  <Button variant="secondary" size="sm" className="w-full">
                    {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                  </Button>
                </Link>
                <button onClick={logout} className="block text-sm text-red-400">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
