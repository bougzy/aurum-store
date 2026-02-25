'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface StoreOwner {
  _id: string;
  name: string;
  email: string;
}

interface Store {
  _id: string;
  name: string;
  slug: string;
  ownerId: StoreOwner;
  isActive: boolean;
  productCount: number;
  orderCount: number;
  createdAt: string;
}

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Store | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStores();
  }, [page]);

  const fetchStores = async () => {
    try {
      const res = await fetch(`/api/admin/stores?page=${page}&limit=20`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setStores(json.stores);
      setTotalPages(json.pages);
    } catch {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (storeId: string, action: 'suspend' | 'activate' | 'delete') => {
    setActionLoading(storeId);
    try {
      const res = await fetch('/api/admin/stores', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, action }),
      });
      if (!res.ok) throw new Error('Action failed');
      toast.success(
        action === 'delete'
          ? 'Store deleted successfully'
          : action === 'suspend'
          ? 'Store suspended'
          : 'Store activated'
      );
      setDeleteTarget(null);
      await fetchStores();
    } catch {
      toast.error('Action failed. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold gold-text">Manage Stores</h1>
          <p className="text-dark-500 text-sm mt-1">Loading stores...</p>
        </div>
        <Card>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="h-10 w-10 bg-dark-700 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-dark-700 rounded w-48" />
                  <div className="h-3 bg-dark-700 rounded w-32" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gold-text">Manage Stores</h1>
          <p className="text-dark-500 text-sm mt-1">View and manage all platform stores</p>
        </div>
        <Badge variant="gold">{stores.length} stores</Badge>
      </div>

      {/* Stores Table */}
      <Card>
        {stores.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-dark-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-dark-500 text-lg">No stores found</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-600">
                    <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Store</th>
                    <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Owner</th>
                    <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Products</th>
                    <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Orders</th>
                    <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Created</th>
                    <th className="text-right py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {stores.map((store) => (
                    <tr key={store._id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="py-3">
                        <p className="text-gold-200 font-medium">{store.name}</p>
                        <p className="text-dark-500 text-xs">/{store.slug}</p>
                      </td>
                      <td className="py-3">
                        <p className="text-gold-300 text-sm">{store.ownerId?.name || 'N/A'}</p>
                        <p className="text-dark-500 text-xs">{store.ownerId?.email || 'N/A'}</p>
                      </td>
                      <td className="py-3 text-dark-500">{store.productCount}</td>
                      <td className="py-3 text-dark-500">{store.orderCount}</td>
                      <td className="py-3">
                        <Badge variant={store.isActive ? 'green' : 'red'}>
                          {store.isActive ? 'Active' : 'Suspended'}
                        </Badge>
                      </td>
                      <td className="py-3 text-dark-500 text-sm">{formatDate(store.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant={store.isActive ? 'outline' : 'secondary'}
                            size="sm"
                            loading={actionLoading === store._id}
                            onClick={() => handleAction(store._id, store.isActive ? 'suspend' : 'activate')}
                          >
                            {store.isActive ? 'Suspend' : 'Activate'}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setDeleteTarget(store)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden space-y-4">
              {stores.map((store) => (
                <div
                  key={store._id}
                  className="bg-dark-700/50 border border-dark-600 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gold-200 font-medium">{store.name}</p>
                      <p className="text-dark-500 text-xs">/{store.slug}</p>
                    </div>
                    <Badge variant={store.isActive ? 'green' : 'red'}>
                      {store.isActive ? 'Active' : 'Suspended'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-dark-500">Owner</p>
                      <p className="text-gold-300">{store.ownerId?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-dark-500">Email</p>
                      <p className="text-gold-300 truncate">{store.ownerId?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-dark-500">Products</p>
                      <p className="text-gold-300">{store.productCount}</p>
                    </div>
                    <div>
                      <p className="text-dark-500">Orders</p>
                      <p className="text-gold-300">{store.orderCount}</p>
                    </div>
                  </div>
                  <p className="text-dark-500 text-xs">Created {formatDate(store.createdAt)}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant={store.isActive ? 'outline' : 'secondary'}
                      size="sm"
                      loading={actionLoading === store._id}
                      onClick={() => handleAction(store._id, store.isActive ? 'suspend' : 'activate')}
                      className="flex-1"
                    >
                      {store.isActive ? 'Suspend' : 'Activate'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteTarget(store)}
                      className="flex-1"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-dark-700">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-dark-500 text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Store"
      >
        <div className="space-y-4">
          <p className="text-dark-500 text-sm">
            Are you sure you want to delete <span className="text-gold-300 font-medium">{deleteTarget?.name}</span>?
            This will permanently remove the store, all its products, and all associated orders. This action cannot be undone.
          </p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-400 text-sm">This is a destructive action. The store owner will lose access to their store and all data.</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={actionLoading === deleteTarget?._id}
              onClick={() => deleteTarget && handleAction(deleteTarget._id, 'delete')}
            >
              Delete Store
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
