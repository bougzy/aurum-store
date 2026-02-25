'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
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
            <p className="text-dark-500 text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent mb-8" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-dark-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
              >
                Create your store
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
