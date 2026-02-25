'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IProduct } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug, productId } = useParams<{ slug: string; productId: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToCart, getItemCount } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/stores/${slug}/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
        }
      } catch {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug, productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold gold-text">Product Not Found</h1>
        <Link href={`/store/${slug}`}><Button variant="outline">Back to Store</Button></Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart(product, slug);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Top bar */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href={`/store/${slug}`} className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Store
          </Link>
          <Link href={`/store/${slug}/cart`}>
            <Button variant="secondary" size="sm">
              Cart ({getItemCount()})
            </Button>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-dark-800 rounded-2xl border border-dark-600 overflow-hidden relative">
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === idx ? 'border-gold-500' : 'border-dark-600 hover:border-dark-500'
                    }`}
                  >
                    <Image src={img} alt="" width={80} height={80} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-[#f5f0e1]">{product.name}</h1>

            <div className="flex items-center gap-3 mt-4">
              <Badge variant="gold">{product.goldPurity}</Badge>
              <Badge variant="gray">{product.weight}g</Badge>
              <Badge variant={product.stock > 0 ? 'green' : 'red'}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </Badge>
            </div>

            <div className="mt-6">
              <span className="text-4xl font-bold gold-text">{formatPrice(product.price)}</span>
            </div>

            <div className="mt-8 space-y-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                Add to Cart
              </Button>

              <Link href={`/store/${slug}/chat`} className="block">
                <Button variant="outline" size="lg" className="w-full">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat with Store
                </Button>
              </Link>
            </div>

            {/* Details */}
            <div className="mt-8 border-t border-dark-700 pt-8">
              <h3 className="text-lg font-semibold text-gold-300 mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
                  <p className="text-xs text-[#f5f0e1]/40 uppercase tracking-wider">Gold Purity</p>
                  <p className="text-lg font-semibold gold-text mt-1">{product.goldPurity}</p>
                </div>
                <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
                  <p className="text-xs text-[#f5f0e1]/40 uppercase tracking-wider">Weight</p>
                  <p className="text-lg font-semibold text-[#f5f0e1] mt-1">{product.weight}g</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gold-300 mb-3">Description</h3>
              <p className="text-[#f5f0e1]/70 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
