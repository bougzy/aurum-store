'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { IStore } from '@/types';

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [store, setStore] = useState<IStore | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [bitcoinWallet, setBitcoinWallet] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.storeId) return;

    const fetchStore = async () => {
      try {
        const res = await fetch('/api/stores');
        const data = await res.json();

        if (data.store) {
          const s: IStore = data.store;
          setStore(s);
          setName(s.name || '');
          setDescription(s.description || '');
          setLogo(s.logo || '');
          setWhatsappNumber(s.whatsappNumber || '');
          setBitcoinWallet(s.bitcoinWallet || '');
        }
      } catch {
        toast.error('Failed to load store settings');
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [user?.storeId]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setLogo(data.url);
      toast.success('Logo uploaded');
    } catch {
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Store name is required');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/stores', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          logo,
          whatsappNumber: whatsappNumber.trim(),
          bitcoinWallet: bitcoinWallet.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStore(data.store);
      toast.success('Store settings saved');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const copyStoreUrl = () => {
    if (!store?.slug) return;
    const url = `${window.location.origin}/store/${store.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Store URL copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold gold-text">Store Settings</h1>
          <p className="text-dark-500 mt-1">Manage your store configuration</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Settings
        </Button>
      </div>

      {/* Store public URL */}
      {store?.slug && (
        <Card>
          <h2 className="text-gold-200 font-medium mb-3">Store Public URL</h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-gold-300 text-sm font-mono truncate">
              {typeof window !== 'undefined' ? window.location.origin : ''}/store/{store.slug}
            </div>
            <Button variant="outline" size="sm" onClick={copyStoreUrl}>
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy
            </Button>
          </div>
        </Card>
      )}

      {/* Store logo */}
      <Card>
        <h2 className="text-gold-200 font-medium mb-4">Store Logo</h2>
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-dark-600 flex items-center justify-center overflow-hidden bg-dark-700 flex-shrink-0">
            {logo ? (
              <img src={logo} alt="Store logo" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-10 h-10 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <div className="space-y-3">
            <p className="text-dark-500 text-sm">Upload a logo for your store. Recommended size: 256x256px.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                loading={uploading}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Logo'}
              </Button>
              {logo && (
                <Button variant="ghost" size="sm" onClick={() => setLogo('')}>
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Store details */}
      <Card>
        <h2 className="text-gold-200 font-medium mb-4">Store Details</h2>
        <div className="space-y-4">
          <Input
            label="Store Name"
            placeholder="Your store name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gold-300 mb-1.5">Description</label>
            <textarea
              className="w-full px-4 py-2.5 bg-dark-800 border border-dark-500 rounded-lg text-[#f5f0e1] placeholder-dark-500/70 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-200 min-h-[100px] resize-y"
              placeholder="Describe your store..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Contact & Payment */}
      <Card>
        <h2 className="text-gold-200 font-medium mb-4">Contact & Payment</h2>
        <div className="space-y-4">
          <Input
            label="WhatsApp Number"
            placeholder="+1234567890"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
          />
          <div className="w-full">
            <Input
              label="Bitcoin Wallet Address"
              placeholder="bc1q..."
              value={bitcoinWallet}
              onChange={(e) => setBitcoinWallet(e.target.value)}
            />
            <p className="mt-1.5 text-xs text-dark-500">
              Customers will send Bitcoin payments to this address
            </p>
          </div>
        </div>
      </Card>

      {/* Bottom save button */}
      <div className="flex justify-end pb-4">
        <Button onClick={handleSave} loading={saving} size="lg">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
