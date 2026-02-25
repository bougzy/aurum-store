'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice, generateOrderMessage, btcConversion } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'bitcoin'>('whatsapp');
  const [loading, setLoading] = useState(false);
  const [storeInfo, setStoreInfo] = useState<{ whatsappNumber?: string; bitcoinWallet?: string; name: string } | null>(null);

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    txHash: '',
  });
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      router.push(`/store/${slug}/cart`);
      return;
    }
    // Fetch store info for whatsapp/bitcoin details
    fetch(`/api/stores/${slug}/products`)
      .then(() => fetch(`/api/stores?slug=${slug}`))
      .then((r) => r.json())
      .then((data) => {
        const store = data.stores?.[0] || data.store;
        if (store) setStoreInfo(store);
      })
      .catch(() => {});
  }, [slug, items.length, router]);

  const handleWhatsAppCheckout = () => {
    if (!form.customerName || !form.customerPhone) {
      toast.error('Please fill in your name and phone');
      return;
    }
    const whatsappItems = items.map((item) => ({
      name: item.product?.name || 'Product',
      quantity: item.quantity,
      price: (item.product?.price || 0) * item.quantity,
    }));
    const message = generateOrderMessage(storeInfo?.name || 'Store', whatsappItems, getTotal());
    const number = storeInfo?.whatsappNumber?.replace(/\D/g, '') || '';
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
    clearCart();
    toast.success('Order sent via WhatsApp!');
    router.push(`/store/${slug}`);
  };

  const handleBitcoinCheckout = async () => {
    if (!form.customerName || !form.customerEmail || !form.customerPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let paymentProofUrl = '';
      if (paymentProofFile) {
        const formData = new FormData();
        formData.append('file', paymentProofFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) paymentProofUrl = uploadData.url;
      }

      // Get storeId from store info
      const storeRes = await fetch(`/api/stores?slug=${slug}`);
      const storeData = await storeRes.json();
      const store = storeData.stores?.[0] || storeData.store;
      if (!store) { toast.error('Store not found'); return; }

      const orderRes = await fetch(`/api/stores/${store._id}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          paymentMethod: 'bitcoin',
          paymentProof: paymentProofUrl,
          txHash: form.txHash,
        }),
      });

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        clearCart();
        toast.success('Order placed! Awaiting payment confirmation.');
        router.push(`/store/${slug}/order/${orderData.order._id}`);
      } else {
        const err = await orderRes.json();
        toast.error(err.error || 'Failed to place order');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const total = getTotal();
  const btcAmount = btcConversion(total);

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href={`/store/${slug}/cart`} className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cart
          </Link>
          <h1 className="text-lg font-semibold gold-text">Checkout</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Customer Info */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gold-300 mb-4">Your Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name *" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="John Doe" />
            <Input label="Email *" type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} placeholder="john@example.com" />
            <Input label="Phone *" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} placeholder="+1 234 567 8900" className="sm:col-span-2" />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gold-300 mb-4">Order Summary</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-[#f5f0e1]/70">{item.product?.name} x{item.quantity}</span>
                <span className="text-[#f5f0e1]">{formatPrice((item.product?.price || 0) * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-dark-600 pt-2 mt-2 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold gold-text">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gold-300 mb-4">Payment Method</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setPaymentMethod('whatsapp')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                paymentMethod === 'whatsapp'
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-dark-600 hover:border-dark-500'
              }`}
            >
              <div className="text-2xl mb-2">💬</div>
              <p className="font-semibold text-sm">WhatsApp</p>
              <p className="text-xs text-[#f5f0e1]/40 mt-1">Order via chat</p>
            </button>
            <button
              onClick={() => setPaymentMethod('bitcoin')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                paymentMethod === 'bitcoin'
                  ? 'border-gold-500 bg-gold-500/10'
                  : 'border-dark-600 hover:border-dark-500'
              }`}
            >
              <div className="text-2xl mb-2">₿</div>
              <p className="font-semibold text-sm">Bitcoin</p>
              <p className="text-xs text-[#f5f0e1]/40 mt-1">Pay with BTC</p>
            </button>
          </div>

          {paymentMethod === 'whatsapp' && (
            <div className="space-y-4">
              <p className="text-sm text-[#f5f0e1]/50">
                You&apos;ll be redirected to WhatsApp with a pre-filled order message.
              </p>
              <Button variant="primary" size="lg" className="w-full" onClick={handleWhatsAppCheckout}>
                Order via WhatsApp
              </Button>
            </div>
          )}

          {paymentMethod === 'bitcoin' && (
            <div className="space-y-4">
              {storeInfo?.bitcoinWallet ? (
                <>
                  <div className="bg-dark-900 rounded-lg p-4">
                    <p className="text-xs text-[#f5f0e1]/40 uppercase tracking-wider mb-2">Send BTC to this address</p>
                    <div className="flex items-center gap-2">
                      <code className="text-gold-400 text-sm break-all flex-1">{storeInfo.bitcoinWallet}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(storeInfo.bitcoinWallet || '');
                          toast.success('Wallet address copied!');
                        }}
                        className="text-gold-400 hover:text-gold-300 p-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="bg-dark-900 rounded-lg p-4">
                    <p className="text-xs text-[#f5f0e1]/40 uppercase tracking-wider mb-1">Amount</p>
                    <p className="text-2xl font-bold gold-text">{btcAmount} BTC</p>
                    <p className="text-xs text-[#f5f0e1]/40 mt-1">≈ {formatPrice(total)} USD</p>
                  </div>
                  <Input label="Transaction Hash" value={form.txHash} onChange={(e) => setForm({ ...form, txHash: e.target.value })} placeholder="Enter your BTC transaction hash" />
                  <div>
                    <label className="block text-sm font-medium text-gold-300 mb-1.5">Payment Proof (screenshot)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPaymentProofFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-[#f5f0e1]/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold-500/10 file:text-gold-400 hover:file:bg-gold-500/20"
                    />
                  </div>
                  <Button variant="primary" size="lg" className="w-full" onClick={handleBitcoinCheckout} loading={loading}>
                    Submit Bitcoin Payment
                  </Button>
                </>
              ) : (
                <p className="text-center text-[#f5f0e1]/50 py-4">
                  This store hasn&apos;t configured Bitcoin payments yet.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
