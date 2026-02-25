'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IProduct, IStore } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function StorePage() {
  const { slug } = useParams<{ slug: string }>();
  const [store, setStore] = useState<IStore | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, getItemCount } = useCart();

  useEffect(() => {
    async function fetchStore() {
      try {
        const [storeRes, productsRes] = await Promise.all([
          fetch(`/api/stores?slug=${slug}`),
          fetch(`/api/stores/${slug}/products`),
        ]);

        if (storeRes.ok) {
          const storeData = await storeRes.json();
          setStore(storeData.stores?.[0] || storeData.store);
        }
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData.products || []);
        }
      } catch {
        toast.error('Failed to load store');
      } finally {
        setLoading(false);
      }
    }
    fetchStore();
  }, [slug]);

  const handleAddToCart = (product: IProduct) => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart(product, slug);
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold gold-text">Store Not Found</h1>
        <Link href="/"><Button variant="outline">Back to Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Store Header */}
      <header className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logo ? (
                <Image src={store.logo} alt={store.name} width={56} height={56} className="w-14 h-14 rounded-xl object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center">
                  <span className="text-dark-900 font-bold text-xl">{store.name[0]}</span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold gold-text">{store.name}</h1>
                {store.description && (
                  <p className="text-[#f5f0e1]/50 text-sm mt-1">{store.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/store/${slug}/chat`}>
                <Button variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat
                </Button>
              </Link>
              <Link href={`/store/${slug}/cart`}>
                <Button variant="secondary" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  Cart ({getItemCount()})
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-gold-300">
            Products ({products.length})
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-dark-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-[#f5f0e1]/50">No products available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300 group"
              >
                <Link href={`/store/${slug}/product/${product._id}`}>
                  <div className="aspect-square bg-dark-700 relative overflow-hidden">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Badge variant="red">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/store/${slug}/product/${product._id}`}>
                    <h3 className="font-semibold text-[#f5f0e1] hover:text-gold-400 transition-colors truncate">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="gold">{product.goldPurity}</Badge>
                    <span className="text-xs text-[#f5f0e1]/40">{product.weight}g</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold gold-text">{formatPrice(product.price)}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
