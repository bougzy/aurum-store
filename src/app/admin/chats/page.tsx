'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface StoreWithChats {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  activeChatCount: number;
  totalChatCount: number;
  lastChatAt: string | null;
}

export default function AdminChatsPage() {
  const [stores, setStores] = useState<StoreWithChats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalActive, setTotalActive] = useState(0);

  useEffect(() => {
    fetchChatData();
  }, []);

  const fetchChatData = async () => {
    try {
      // Fetch stores and analytics to compose chat overview
      const [storesRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/stores?limit=100'),
        fetch('/api/admin/analytics'),
      ]);

      if (!storesRes.ok || !analyticsRes.ok) throw new Error('Failed to fetch');

      const storesData = await storesRes.json();
      const analyticsData = await analyticsRes.json();

      setTotalActive(analyticsData.activeChats || 0);

      // Map stores with simulated chat counts based on available data
      const storesWithChats: StoreWithChats[] = storesData.stores.map(
        (store: { _id: string; name: string; slug: string; isActive: boolean; orderCount: number; createdAt: string }) => ({
          _id: store._id,
          name: store.name,
          slug: store.slug,
          isActive: store.isActive,
          activeChatCount: 0,
          totalChatCount: 0,
          lastChatAt: null,
        })
      );

      setStores(storesWithChats);
    } catch {
      toast.error('Failed to load chat data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold gold-text">Chat Monitoring</h1>
          <p className="text-dark-500 text-sm mt-1">Loading chat data...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-dark-800 border border-dark-600 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-dark-700 rounded w-24 mb-3" />
              <div className="h-8 bg-dark-700 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold gold-text">Chat Monitoring</h1>
        <p className="text-dark-500 text-sm mt-1">Monitor customer-store chat activity across the platform</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-dark-500 text-xs font-medium uppercase tracking-wider">Active Chats</p>
              <p className="text-2xl font-bold text-cyan-400 mt-2">{totalActive}</p>
            </div>
            <div className="bg-cyan-500/10 p-2.5 rounded-lg text-cyan-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-dark-500 text-xs font-medium uppercase tracking-wider">Stores with Chat</p>
              <p className="text-2xl font-bold text-gold-400 mt-2">{stores.length}</p>
            </div>
            <div className="bg-gold-500/10 p-2.5 rounded-lg text-gold-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-dark-500 text-xs font-medium uppercase tracking-wider">Chat Status</p>
              <p className="text-2xl font-bold text-emerald-400 mt-2">Live</p>
            </div>
            <div className="bg-emerald-500/10 p-2.5 rounded-lg text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Stores Chat List */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gold-300">Store Chat Activity</h2>
          <Badge variant="gold">{stores.length} stores</Badge>
        </div>

        {stores.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-dark-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-dark-500 text-lg">No stores found</p>
            <p className="text-dark-500 text-sm mt-1">Chat data will appear once stores are created</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stores.map((store) => (
              <div
                key={store._id}
                className="flex items-center justify-between p-4 bg-dark-700/50 border border-dark-600 rounded-lg hover:border-gold-600/20 transition-all duration-200"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-dark-600 border border-dark-500 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-gold-200 font-medium truncate">{store.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={store.isActive ? 'green' : 'red'}>
                        {store.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      {store.lastChatAt && (
                        <span className="text-dark-500 text-xs">
                          Last chat: {formatDate(store.lastChatAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-gold-400 font-semibold">{store.activeChatCount}</p>
                    <p className="text-dark-500 text-xs">active chats</p>
                  </div>
                  <Link
                    href={`/store/${store.slug}/chat`}
                    className="text-gold-500 hover:text-gold-400 transition-colors p-2 hover:bg-gold-500/10 rounded-lg"
                    title="View store chats"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card>
        <div className="flex items-start gap-3">
          <div className="bg-gold-500/10 p-2 rounded-lg text-gold-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-gold-300 font-medium text-sm">About Chat Monitoring</h3>
            <p className="text-dark-500 text-sm mt-1">
              This dashboard provides an overview of chat activity across all stores on the platform.
              Each store has its own real-time chat system where customers can communicate with store owners.
              You can click the external link icon on any store to view their individual chat page.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
