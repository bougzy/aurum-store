'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4">
        <svg className="w-20 h-20 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h2 className="text-xl font-semibold text-[#f5f0e1]/70">Your cart is empty</h2>
        <Link href={`/store/${slug}`}>
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href={`/store/${slug}`} className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Continue Shopping
          </Link>
          <h1 className="text-lg font-semibold gold-text">Shopping Cart</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-dark-800 border border-dark-600 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-20 h-20 rounded-lg bg-dark-700 overflow-hidden flex-shrink-0 relative">
                {item.product?.images?.[0] ? (
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-dark-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#f5f0e1] truncate">{item.product?.name}</h3>
                <p className="text-sm text-gold-400 mt-0.5">
                  {formatPrice(item.product?.price || 0)} each
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-dark-700 border border-dark-600 flex items-center justify-center text-[#f5f0e1] hover:border-gold-500/30 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-dark-700 border border-dark-600 flex items-center justify-center text-[#f5f0e1] hover:border-gold-500/30 transition-colors"
                >
                  +
                </button>
              </div>

              <div className="text-right min-w-[80px]">
                <p className="font-bold gold-text">{formatPrice((item.product?.price || 0) * item.quantity)}</p>
              </div>

              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-dark-500 hover:text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-dark-800 border border-dark-600 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#f5f0e1]/70">Subtotal ({items.length} items)</span>
            <span className="text-2xl font-bold gold-text">{formatPrice(getTotal())}</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => clearCart()} className="flex-1">
              Clear Cart
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => router.push(`/store/${slug}/checkout`)}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
