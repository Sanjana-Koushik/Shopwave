import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import { Plus, Pencil, Trash2, X, Check, Package } from 'lucide-react';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const EMPTY_FORM = {
  name: '', price: '', description: '', category: 'Fashion',
  stockCount: '', imageUrl: '', featured: false,
};

const ProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState(product ? { ...product, price: String(product.price), stockCount: String(product.stockCount) } : EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = { ...form, price: Number(form.price), stockCount: Number(form.stockCount) };
      if (product) {
        const { data } = await updateProduct(product._id, payload);
        onSave(data.product, 'update');
      } else {
        const { data } = await createProduct(payload);
        onSave(data.product, 'create');
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white text-xl">{product ? 'Edit Product' : 'Add New Product'}</h2>
            <button onClick={onClose} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Product Name *', name: 'name', placeholder: 'Floral Summer Dress' },
              { label: 'Price (₹) *', name: 'price', placeholder: '1899', type: 'number' },
              { label: 'Stock Count *', name: 'stockCount', placeholder: '50', type: 'number' },
              { label: 'Image URL *', name: 'imageUrl', placeholder: 'https://images.unsplash.com/...' },
            ].map(({ label, name, placeholder, type = 'text' }) => (
              <div key={name}>
                <label className="text-stone-400 text-xs uppercase font-semibold tracking-wide block mb-1">{label}</label>
                <input type={type} name={name} value={form[name]} onChange={update} placeholder={placeholder} className="input-field" />
              </div>
            ))}

            <div>
              <label className="text-stone-400 text-xs uppercase font-semibold tracking-wide block mb-1">Category *</label>
              <select name="category" value={form.category} onChange={update} className="input-field">
                <option value="Fashion">Fashion</option>
                <option value="Crochet">Crochet</option>
                <option value="Books">Books</option>
              </select>
            </div>

            <div>
              <label className="text-stone-400 text-xs uppercase font-semibold tracking-wide block mb-1">Description *</label>
              <textarea name="description" value={form.description} onChange={update} placeholder="Product description..." className="input-field h-24 resize-none" />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="featured" checked={form.featured} onChange={update} className="w-4 h-4 accent-rose-500" />
              <span className="text-stone-300 text-sm">Mark as Featured</span>
            </label>
          </div>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="btn-secondary flex-1 text-sm">Cancel</button>
            <button onClick={handleSave} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
              {loading ? <Spinner size="sm" /> : <Check className="w-4 h-4" />}
              {loading ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | product object
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getProducts({ limit: 100 }).then(({ data }) => {
      setProducts(data.products);
      setLoading(false);
    });
  }, []);

  const handleSave = (product, action) => {
    if (action === 'create') setProducts((prev) => [product, ...prev]);
    else setProducts((prev) => prev.map((p) => (p._id === product._id ? product : p)));
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget._id);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch { /* no-op */ } finally { setDeleting(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Product Manager</h1>
            <p className="text-stone-400 mt-1">{products.length} products in catalog</p>
          </div>
          <button onClick={() => setModal('create')} className="btn-primary flex items-center gap-2" id="add-product-btn">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-stone-400">
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Featured</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-white/3 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-12 object-cover rounded-lg bg-warm-700 flex-shrink-0" />
                        <span className="text-white font-medium line-clamp-1 max-w-[200px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${product.category === 'Fashion' ? 'badge-fashion' : product.category === 'Crochet' ? 'badge-crochet' : 'badge-books'}`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 text-rose-400 font-semibold">{fmt(product.price)}</td>
                    <td className="p-4">
                      <span className={`font-medium ${product.stockCount > 5 ? 'text-sage-400' : product.stockCount > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                        {product.stockCount}
                      </span>
                    </td>
                    <td className="p-4">
                      {product.featured ? (
                        <span className="text-amber-400">✦ Yes</span>
                      ) : (
                        <span className="text-stone-600">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setModal(product)}
                          className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5 text-stone-300" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modal && (
        <ProductModal
          product={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="glass-card p-6 max-w-sm w-full animate-slide-up text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Delete Product?</h3>
              <p className="text-stone-400 text-sm mb-5">"{deleteTarget.name}" will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1 text-sm">Cancel</button>
                <button onClick={confirmDelete} disabled={deleting} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                  {deleting ? <Spinner size="sm" /> : <Trash2 className="w-4 h-4" />}
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductManager;
