'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { IOrder } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const statusConfig: Record<string, { label: string; variant: 'gold' | 'green' | 'red' | 'yellow' | 'gray' }> = {
  pending: { label: 'Pending', variant: 'yellow' },
  awaitingConfirmation: { label: 'Awaiting Confirmation', variant: 'gold' },
  confirmed: { label: 'Confirmed', variant: 'green' },
  cancelled: { label: 'Cancelled', variant: 'gray' },
  rejected: { label: 'Rejected', variant: 'red' },
};

export default function OrderStatusPage() {
  const { slug, orderId } = useParams<{ slug: string; orderId: string }>();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/stores/placeholder/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch {
        // Order fetch failed
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold gold-text">Order Not Found</h1>
        <Link href={`/store/${slug}`}><Button variant="outline">Back to Store</Button></Link>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/store/${slug}`} className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Store
          </Link>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Order Status */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 text-center">
          <Badge variant={status.variant} className="text-sm px-4 py-1">{status.label}</Badge>
          <h1 className="text-2xl font-bold gold-text mt-4">Order #{order._id.slice(-8)}</h1>
          <p className="text-[#f5f0e1]/50 text-sm mt-2">{formatDate(order.createdAt)}</p>
        </div>

        {/* Items */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
          <h2 className="font-semibold text-gold-300 mb-4">Items</h2>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-[#f5f0e1]/70">
                  {item.name} x{item.quantity}
                  <span className="text-[#f5f0e1]/40 ml-2">({item.goldPurity}, {item.weight}g)</span>
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-dark-600 pt-3 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold gold-text">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
          <h2 className="font-semibold text-gold-300 mb-4">Payment</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#f5f0e1]/50">Method</span>
              <span className="capitalize">{order.paymentMethod}</span>
            </div>
            {order.bitcoinAmount && (
              <div className="flex justify-between">
                <span className="text-[#f5f0e1]/50">BTC Amount</span>
                <span className="gold-text font-mono">{order.bitcoinAmount} BTC</span>
              </div>
            )}
            {order.txHash && (
              <div className="flex justify-between">
                <span className="text-[#f5f0e1]/50">Tx Hash</span>
                <span className="font-mono text-xs text-gold-400 break-all max-w-[200px] text-right">{order.txHash}</span>
              </div>
            )}
          </div>
        </div>

        {order.status === 'awaitingConfirmation' && (
          <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-6 text-center">
            <p className="text-gold-300">
              Your payment is being reviewed by the store owner. You&apos;ll see the status update here once confirmed.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
