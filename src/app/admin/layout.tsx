'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/lib/utils';

const navLinks = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
      </svg>
    ),
  },
  {
    href: '/admin/stores',
    label: 'Stores',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18l-2 13H5L3 3zm0 0l-1 1m20-1l1 1M9 21h6M9 21a2 2 0 01-2-2h10a2 2 0 01-2 2M9 21H7" />
      </svg>
    ),
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/chats',
    label: 'Chats',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gold-400 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-dark-800 border-r border-dark-600
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Branding */}
          <div className="p-5 border-b border-dark-600">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center">
                <svg className="w-5 h-5 text-dark-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold gold-text">AurumStore</h1>
                <p className="text-[10px] uppercase tracking-widest text-gold-600 font-semibold">Super Admin</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200 group
                    ${
                      active
                        ? 'bg-gold-600/15 text-gold-400 border border-gold-600/25'
                        : 'text-dark-500 hover:text-gold-300 hover:bg-dark-700 border border-transparent'
                    }
                  `}
                >
                  <span className={active ? 'text-gold-500' : 'text-dark-500 group-hover:text-gold-500 transition-colors'}>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t border-dark-600">
            {user && (
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gold-600/20 border border-gold-600/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-gold-400">{getInitials(user.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gold-300 truncate">{user.name}</p>
                  <p className="text-xs text-dark-500 truncate">{user.email}</p>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden sticky top-0 z-30 bg-dark-800/95 backdrop-blur-sm border-b border-dark-600">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gold-400 hover:bg-dark-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md gold-gradient flex items-center justify-center">
                <svg className="w-4 h-4 text-dark-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-sm font-bold gold-text">Admin</span>
            </div>
            {user && (
              <div className="w-8 h-8 rounded-full bg-gold-600/20 border border-gold-600/30 flex items-center justify-center">
                <span className="text-[10px] font-bold text-gold-400">{getInitials(user.name)}</span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
