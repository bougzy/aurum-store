'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Analytics {
  totalStores: number;
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  activeChats: number;
  totalRevenue: number;
  recentOrders: Array<{
    _id: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: string;
    storeId: string;
    createdAt: string;
  }>;
  storesByMonth: Array<{
    _id: string;
    count: number;
  }>;
}

const statCards = [
  {
    key: 'totalStores' as const,
    label: 'Total Stores',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    format: (v: number) => v.toLocaleString(),
    color: 'text-gold-400',
    bg: 'bg-gold-500/10',
  },
  {
    key: 'totalUsers' as const,
    label: 'Total Users',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    format: (v: number) => v.toLocaleString(),
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    key: 'totalProducts' as const,
    label: 'Total Products',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    format: (v: number) => v.toLocaleString(),
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    key: 'totalOrders' as const,
    label: 'Total Orders',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    format: (v: number) => v.toLocaleString(),
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    key: 'activeChats' as const,
    label: 'Active Chats',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    format: (v: number) => v.toLocaleString(),
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    key: 'totalRevenue' as const,
    label: 'Total Revenue',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    format: (v: number) => formatPrice(v),
    color: 'text-gold-400',
    bg: 'bg-gold-500/10',
  },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case 'confirmed': return 'green' as const;
    case 'pending': return 'yellow' as const;
    case 'awaitingConfirmation': return 'gold' as const;
    case 'cancelled':
    case 'rejected': return 'red' as const;
    default: return 'gray' as const;
  }
};

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold gold-text">Dashboard</h1>
          <p className="text-dark-500 text-sm mt-1">Loading analytics...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-dark-800 border border-dark-600 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-dark-700 rounded w-24 mb-3" />
              <div className="h-8 bg-dark-700 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg className="w-16 h-16 text-dark-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-dark-500 text-lg">Failed to load analytics data</p>
        <button onClick={fetchAnalytics} className="mt-3 text-gold-500 hover:text-gold-400 text-sm underline">
          Try again
        </button>
      </div>
    );
  }

  const maxBarCount = Math.max(...data.storesByMonth.map((m) => m.count), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold gold-text">Dashboard</h1>
        <p className="text-dark-500 text-sm mt-1">Platform overview and analytics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.key} hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-dark-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl font-bold mt-2 ${stat.color}`}>
                  {stat.format(data[stat.key])}
                </p>
              </div>
              <div className={`${stat.bg} p-2.5 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gold-300">Recent Orders</h2>
              <Badge variant="gold">{data.recentOrders.length} latest</Badge>
            </div>
            {data.recentOrders.length === 0 ? (
              <p className="text-dark-500 text-sm text-center py-8">No orders yet</p>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-600">
                      <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Customer</th>
                      <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Total</th>
                      <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {data.recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-dark-700/50 transition-colors">
                        <td className="py-3">
                          <p className="text-gold-200 font-medium">{order.customerName}</p>
                          <p className="text-dark-500 text-xs">{order.customerEmail}</p>
                        </td>
                        <td className="py-3 text-gold-400 font-medium">{formatPrice(order.total)}</td>
                        <td className="py-3">
                          <Badge variant={statusBadgeVariant(order.status)}>{order.status}</Badge>
                        </td>
                        <td className="py-3 text-dark-500">{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Stores by Month */}
        <div className="xl:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gold-300">Stores by Month</h2>
              <Badge variant="gold">{data.storesByMonth.length} months</Badge>
            </div>
            {data.storesByMonth.length === 0 ? (
              <p className="text-dark-500 text-sm text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-3">
                {data.storesByMonth.map((month) => (
                  <div key={month._id}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-dark-500">{month._id}</span>
                      <span className="text-gold-400 font-medium">{month.count}</span>
                    </div>
                    <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full gold-gradient transition-all duration-500"
                        style={{ width: `${(month.count / maxBarCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
