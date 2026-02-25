'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { IOrder, OrderStatus } from '@/types';

type FilterStatus = 'all' | OrderStatus;

const statusFilters: { label: string; value: FilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Awaiting Confirmation', value: 'awaitingConfirmation' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!user?.storeId) return;
    try {
      const url = filter === 'all'
        ? `/api/stores/${user.storeId}/orders`
        : `/api/stores/${user.storeId}/orders?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders();
  }, [user?.storeId, filter]);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (!user?.storeId) return;

    setUpdatingOrder(orderId);
    try {
      const res = await fetch(`/api/stores/${user.storeId}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(`Order ${status === 'confirmed' ? 'approved' : status}`);
      fetchOrders();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update order');
    } finally {
      setUpdatingOrder(null);
    }
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
      case 'awaitingConfirmation': return 'Awaiting Confirmation';
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold gold-text">Orders</h1>
        <p className="text-dark-500 mt-1">Manage and track customer orders</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === f.value
                ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                : 'text-dark-500 hover:text-gold-300 hover:bg-dark-700/50 border border-transparent'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-dark-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-gold-200 font-medium mb-2">No orders found</h3>
            <p className="text-dark-500 text-sm">
              {filter === 'all'
                ? 'Orders will appear here when customers make purchases'
                : `No ${statusLabel(filter).toLowerCase()} orders`}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order._id}>
              {/* Order summary row */}
              <button
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                className="w-full text-left"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-gold-300 font-mono text-sm">#{order._id.slice(-8)}</p>
                      <p className="text-gold-200 text-sm font-medium truncate">{order.customerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 text-sm pl-14 sm:pl-0">
                    <span className="text-dark-500">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-gold-200 font-medium">{formatPrice(order.total)}</span>
                    <Badge variant={statusBadgeVariant(order.status)}>
                      {statusLabel(order.status)}
                    </Badge>
                    <span className="text-dark-500 hidden sm:inline">{formatDate(order.createdAt)}</span>
                    <svg
                      className={`w-5 h-5 text-dark-500 transition-transform duration-200 ${
                        expandedOrder === order._id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Expanded order details */}
              {expandedOrder === order._id && (
                <div className="mt-4 pt-4 border-t border-dark-600 space-y-4">
                  {/* Customer info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Customer</p>
                      <p className="text-gold-200 text-sm">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Email</p>
                      <p className="text-gold-200 text-sm">{order.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-gold-200 text-sm">{order.customerPhone}</p>
                    </div>
                  </div>

                  {/* Order items */}
                  <div>
                    <p className="text-xs text-dark-500 uppercase tracking-wider mb-2">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between bg-dark-700/50 rounded-lg px-4 py-2.5">
                          <div className="flex items-center gap-3">
                            <span className="text-gold-200 text-sm">{item.name}</span>
                            <Badge variant="gold">{item.goldPurity}</Badge>
                            <span className="text-dark-500 text-xs">{item.weight}g</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-dark-500 text-sm">x{item.quantity}</span>
                            <span className="text-gold-200 text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Payment Method</p>
                      <p className="text-gold-200 text-sm capitalize">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Order Date</p>
                      <p className="text-gold-200 text-sm">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Total</p>
                      <p className="text-gold-400 text-sm font-bold">{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  {/* Bitcoin payment proof */}
                  {order.paymentMethod === 'bitcoin' && (
                    <div className="space-y-3">
                      {order.txHash && (
                        <div>
                          <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Transaction Hash</p>
                          <p className="text-gold-300 text-sm font-mono break-all bg-dark-700/50 rounded-lg px-4 py-2">
                            {order.txHash}
                          </p>
                        </div>
                      )}
                      {order.bitcoinAmount && (
                        <div>
                          <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Bitcoin Amount</p>
                          <p className="text-gold-200 text-sm">{order.bitcoinAmount} BTC</p>
                        </div>
                      )}
                      {order.paymentProof && (
                        <div>
                          <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Payment Proof</p>
                          <div className="mt-1 relative w-full max-w-sm rounded-lg overflow-hidden border border-dark-600">
                            <img
                              src={order.paymentProof}
                              alt="Payment proof"
                              className="w-full h-auto"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  {(order.status === 'pending' || order.status === 'awaitingConfirmation') && (
                    <div className="flex gap-3 pt-2">
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order._id, 'confirmed')}
                        loading={updatingOrder === order._id}
                        disabled={updatingOrder === order._id}
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve Order
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => updateOrderStatus(order._id, 'rejected')}
                        loading={updatingOrder === order._id}
                        disabled={updatingOrder === order._id}
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject Order
                      </Button>
                      {order.status !== 'cancelled' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateOrderStatus(order._id, 'cancelled')}
                          loading={updatingOrder === order._id}
                          disabled={updatingOrder === order._id}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
