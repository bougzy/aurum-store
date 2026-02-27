'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { IProduct } from '@/types';

interface ProductForm {
  name: string;
  description: string;
  goldPurity: string;
  weight: string;
  price: string;
  stock: string;
  images: string[];
}

const emptyForm: ProductForm = {
  name: '',
  description: '',
  goldPurity: '24K',
  weight: '',
  price: '',
  stock: '',
  images: [],
};

const purityOptions = ['24K', '22K', '18K', '14K'];

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    if (!user?.storeId) return;
    try {
      const res = await fetch(`/api/stores/${user.storeId}/products`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user?.storeId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);
        uploadedUrls.push(data.url);
      }

      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAdd = async () => {
    if (!user?.storeId) return;
    if (!form.name || !form.description || !form.weight || !form.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/stores/${user.storeId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          goldPurity: form.goldPurity,
          weight: parseFloat(form.weight),
          price: parseFloat(form.price),
          stock: parseInt(form.stock) || 0,
          images: form.images,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('Product created successfully');
      setShowAddModal(false);
      setForm(emptyForm);
      fetchProducts();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      goldPurity: product.goldPurity,
      weight: product.weight.toString(),
      price: product.price.toString(),
      stock: product.stock.toString(),
      images: product.images || [],
    });
    setShowEditModal(true);
  };

  const handleEdit = async () => {
    if (!user?.storeId || !selectedProduct) return;
    if (!form.name || !form.description || !form.weight || !form.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/stores/${user.storeId}/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          goldPurity: form.goldPurity,
          weight: parseFloat(form.weight),
          price: parseFloat(form.price),
          stock: parseInt(form.stock) || 0,
          images: form.images,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('Product updated successfully');
      setShowEditModal(false);
      setSelectedProduct(null);
      setForm(emptyForm);
      fetchProducts();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.storeId || !selectedProduct) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/stores/${user.storeId}/products/${selectedProduct._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      toast.success('Product deleted');
      setShowDeleteModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setSaving(false);
    }
  };

  const productFormFields = (
    <div className="space-y-4">
      <Input
        label="Product Name"
        placeholder="e.g., 24K Gold Ring"
        value={form.name}
        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
      />
      <div className="w-full">
        <label className="block text-sm font-medium text-gold-300 mb-1.5">Description</label>
        <textarea
          className="w-full px-4 py-2.5 bg-dark-800 border border-dark-500 rounded-lg text-[#f5f0e1] placeholder-dark-500/70 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-200 min-h-[80px] resize-y"
          placeholder="Describe your product..."
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
      </div>
      <div className="w-full">
        <label className="block text-sm font-medium text-gold-300 mb-1.5">Gold Purity</label>
        <select
          className="w-full px-4 py-2.5 bg-dark-800 border border-dark-500 rounded-lg text-[#f5f0e1] focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-200"
          value={form.goldPurity}
          onChange={(e) => setForm((prev) => ({ ...prev, goldPurity: e.target.value }))}
        >
          {purityOptions.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Weight (g)"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={form.weight}
          onChange={(e) => setForm((prev) => ({ ...prev, weight: e.target.value }))}
        />
        <Input
          label="Price ($)"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={form.price}
          onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
        />
        <Input
          label="Stock"
          type="number"
          placeholder="0"
          value={form.stock}
          onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
        />
      </div>

      {/* Image upload */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gold-300 mb-1.5">Product Images</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {form.images.map((url, i) => (
            <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-dark-600 group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          loading={uploading}
          disabled={uploading}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {uploading ? 'Uploading...' : 'Upload Images'}
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold gold-text">Products</h1>
          <p className="text-dark-500 mt-1">{products.length} product{products.length !== 1 ? 's' : ''} in your store</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setShowAddModal(true); }}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Button>
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-dark-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-gold-200 font-medium mb-2">No products yet</h3>
            <p className="text-dark-500 text-sm mb-6">Add your first gold product to get started</p>
            <Button onClick={() => { setForm(emptyForm); setShowAddModal(true); }}>Add Your First Product</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product._id} hover>
              {/* Product image */}
              <div className="relative w-full h-48 -mt-6 -mx-6 mb-4 overflow-hidden rounded-t-xl" style={{ width: 'calc(100% + 3rem)' }}>
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-dark-700 flex items-center justify-center">
                    <svg className="w-12 h-12 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant={product.stock > 0 ? 'green' : 'red'}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </Badge>
                </div>
              </div>

              {/* Product info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-gold-200 font-medium truncate">{product.name}</h3>
                  <Badge variant="gold">{product.goldPurity}</Badge>
                </div>
                <p className="text-dark-500 text-sm line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-gold-400 text-lg font-bold">{formatPrice(product.price)}</p>
                    <p className="text-dark-500 text-xs">{product.weight}g</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-2 rounded-lg text-dark-500 hover:text-gold-400 hover:bg-dark-700 transition-all"
                      title="Edit product"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => { setSelectedProduct(product); setShowDeleteModal(true); }}
                      className="p-2 rounded-lg text-dark-500 hover:text-red-400 hover:bg-dark-700 transition-all"
                      title="Delete product"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Product">
        {productFormFields}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-dark-600">
          <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button onClick={handleAdd} loading={saving}>Create Product</Button>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Product">
        {productFormFields}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-dark-600">
          <Button variant="ghost" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button onClick={handleEdit} loading={saving}>Save Changes</Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Product">
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gold-200 mb-2">
            Are you sure you want to delete <span className="font-semibold">{selectedProduct?.name}</span>?
          </p>
          <p className="text-dark-500 text-sm">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-dark-600">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={saving}>Delete Product</Button>
        </div>
      </Modal>
    </div>
  );
}
