'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'storeOwner' | 'customer';
  storeId?: string;
  phone?: string;
  createdAt: string;
}

const roleBadgeVariant = (role: string) => {
  switch (role) {
    case 'admin': return 'gold' as const;
    case 'storeOwner': return 'green' as const;
    case 'customer': return 'gray' as const;
    default: return 'gray' as const;
  }
};

const roleLabel = (role: string) => {
  switch (role) {
    case 'admin': return 'Admin';
    case 'storeOwner': return 'Store Owner';
    case 'customer': return 'Customer';
    default: return role;
  }
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=20`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setUsers(json.users);
      setTotalPages(json.pages);
      setTotal(json.total);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold gold-text">Manage Users</h1>
          <p className="text-dark-500 text-sm mt-1">Loading users...</p>
        </div>
        <Card>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="h-10 w-10 bg-dark-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-dark-700 rounded w-40" />
                  <div className="h-3 bg-dark-700 rounded w-56" />
                </div>
                <div className="h-6 bg-dark-700 rounded-full w-20" />
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
          <h1 className="text-2xl font-bold gold-text">Manage Users</h1>
          <p className="text-dark-500 text-sm mt-1">View all registered users on the platform</p>
        </div>
        <Badge variant="gold">{total} users</Badge>
      </div>

      {/* Users Table */}
      <Card>
        {users.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-dark-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-dark-500 text-lg">No users found</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-600">
                    <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">User</th>
                    <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Email</th>
                    <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Role</th>
                    <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Store ID</th>
                    <th className="text-left py-3 text-dark-500 font-medium text-xs uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-dark-600 border border-dark-500 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-gold-400">{getInitials(user.name)}</span>
                          </div>
                          <span className="text-gold-200 font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-dark-500">{user.email}</td>
                      <td className="py-3">
                        <Badge variant={roleBadgeVariant(user.role)}>{roleLabel(user.role)}</Badge>
                      </td>
                      <td className="py-3">
                        {user.storeId ? (
                          <span className="text-gold-500 text-xs font-mono bg-gold-500/10 px-2 py-0.5 rounded">
                            {user.storeId}
                          </span>
                        ) : (
                          <span className="text-dark-500 text-xs">--</span>
                        )}
                      </td>
                      <td className="py-3 text-dark-500 text-sm">{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden space-y-3">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-dark-700/50 border border-dark-600 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-dark-600 border border-dark-500 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-gold-400">{getInitials(user.name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-gold-200 font-medium truncate">{user.name}</p>
                        <Badge variant={roleBadgeVariant(user.role)}>{roleLabel(user.role)}</Badge>
                      </div>
                      <p className="text-dark-500 text-xs mt-0.5 truncate">{user.email}</p>
                      <div className="flex items-center justify-between mt-2">
                        {user.storeId ? (
                          <span className="text-gold-500 text-xs font-mono bg-gold-500/10 px-2 py-0.5 rounded truncate max-w-[160px]">
                            {user.storeId}
                          </span>
                        ) : (
                          <span className="text-dark-500 text-xs">No store</span>
                        )}
                        <span className="text-dark-500 text-xs">{formatDate(user.createdAt)}</span>
                      </div>
                    </div>
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
    </div>
  );
}
