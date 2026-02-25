'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { IStore, IProduct, IOrder } from '@/types';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [store, setStore] = useState<IStore | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.storeId) return;

    const fetchData = async () => {
      try {
        const [storeRes, productsRes, ordersRes] = await Promise.all([
          fetch('/api/stores'),
          fetch(`/api/stores/${user.storeId}/products`),
          fetch(`/api/stores/${user.storeId}/orders`),
        ]);

        const storeData = await storeRes.json();
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        setStore(storeData.store || null);
        setProducts(productsData.products || []);
        setTotalProducts(productsData.total || 0);
        setOrders(ordersData.orders || []);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.storeId]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'awaitingConfirmation').length;
  const revenue = orders
    .filter((o) => o.status === 'confirmed')
    .reduce((sum, o) => sum + o.total, 0);
  const recentOrders = orders.slice(0, 5);

  const copyStoreLink = () => {
    if (!store?.slug) return;
    const url = `${window.location.origin}/store/${store.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Store link copied to clipboard!');
  };

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

  const statusLabel = (status: string) => {
    switch (status) {
      case 'awaitingConfirmation': return 'Awaiting';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold gold-text">Dashboard Overview</h1>
          <p className="text-dark-500 mt-1">
            Welcome back, {user?.name || 'Store Owner'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={copyStoreLink}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copy Store Link
          </Button>
          <Link href="/dashboard/products">
            <Button size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Button>
          </Link>
          {store?.slug && (
            <Link href={`/store/${store.slug}`} target="_blank">
              <Button variant="secondary" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Store
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-dark-500 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-gold-200">{totalProducts}</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-dark-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gold-200">{totalOrders}</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-dark-500 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold text-gold-200">{pendingOrders}</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-dark-500 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-gold-200">{formatPrice(revenue)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gold-200">Recent Orders</h2>
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-dark-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-dark-500">No orders yet</p>
            <p className="text-dark-500/60 text-sm mt-1">Orders will appear here once customers start purchasing</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="text-left text-xs font-medium text-dark-500 uppercase tracking-wider pb-3 pr-4">Order ID</th>
                  <th className="text-left text-xs font-medium text-dark-500 uppercase tracking-wider pb-3 pr-4">Customer</th>
                  <th className="text-left text-xs font-medium text-dark-500 uppercase tracking-wider pb-3 pr-4">Items</th>
                  <th className="text-left text-xs font-medium text-dark-500 uppercase tracking-wider pb-3 pr-4">Total</th>
                  <th className="text-left text-xs font-medium text-dark-500 uppercase tracking-wider pb-3 pr-4">Status</th>
                  <th className="text-left text-xs font-medium text-dark-500 uppercase tracking-wider pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-dark-700/30 transition-colors">
                    <td className="py-3 pr-4">
                      <span className="text-gold-300 font-mono text-sm">
                        #{order._id.slice(-8)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-gold-200 text-sm">{order.customerName}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-dark-500 text-sm">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-gold-200 text-sm font-medium">{formatPrice(order.total)}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusBadgeVariant(order.status)}>
                        {statusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <span className="text-dark-500 text-sm">{formatDate(order.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
