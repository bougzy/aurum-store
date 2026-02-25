'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { slugify } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-generate slug from store name unless user has manually edited it
  useEffect(() => {
    if (!slugEdited) {
      setStoreSlug(slugify(storeName));
    }
  }, [storeName, slugEdited]);

  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    setStoreSlug(slugify(value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !phone || !storeName || !storeSlug) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        phone,
        storeName,
        storeSlug,
      });
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-dark-800 rounded-2xl border border-dark-600 shadow-2xl shadow-black/50 p-8">
          {/* Branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4 shadow-lg shadow-gold-500/20">
              <span className="text-dark-900 font-bold text-xl">A</span>
            </div>
            <h1 className="text-2xl font-bold gold-text">AurumStore</h1>
            <p className="text-dark-500 text-sm mt-1">Create your premium store</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent mb-8" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 234 567 890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />

            {/* Divider with label */}
            <div className="flex items-center gap-3 pt-2">
              <div className="h-px flex-1 bg-dark-600" />
              <span className="text-xs text-gold-500/70 uppercase tracking-wider font-medium">Store Details</span>
              <div className="h-px flex-1 bg-dark-600" />
            </div>

            <Input
              label="Store Name"
              type="text"
              placeholder="My Gold Store"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />

            <div>
              <Input
                label="Store Slug"
                type="text"
                placeholder="my-gold-store"
                value={storeSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
              />
              {storeSlug && (
                <p className="mt-1.5 text-xs text-gold-500/60">
                  Your store will be available at{' '}
                  <span className="text-gold-400 font-medium">
                    aurumstore.com/store/{storeSlug}
                  </span>
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              Create Store
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-dark-500">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-8 text-center">
          <p className="text-xs text-dark-500/60">
            Premium Gold E-Commerce Platform
          </p>
        </div>
      </div>
    </div>
  );
}
