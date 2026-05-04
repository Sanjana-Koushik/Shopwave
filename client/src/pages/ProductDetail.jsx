import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import Spinner from '../components/ui/Spinner';
import { ShoppingCart, ArrowLeft, Star, Package, Truck, RotateCcw } from 'lucide-react';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const categoryColors = {
  Fashion: 'badge-fashion',
  Crochet: 'badge-crochet',
  Books: 'badge-books',
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getProductById(id);
        setProduct(data.product);
      } catch {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    openDrawer();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Spinner size="lg" />
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16 gap-4">
        <p className="text-red-400">{error || 'Product not found'}</p>
        <button onClick={() => navigate('/products')} className="btn-secondary">Back to Products</button>
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-stone-400 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden bg-warm-700 group">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.featured && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                ✦ Featured
              </span>
            )}
            {product.stockCount === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-black/70 text-white font-semibold px-4 py-2 rounded-full">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col animate-fade-in">
            <span className={categoryColors[product.category] || 'badge'}>{product.category}</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mt-3 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating || 4) ? 'fill-amber-400 text-amber-400' : 'text-stone-600'}`} />
                ))}
              </div>
              <span className="text-stone-400 text-sm">({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-5">
              <span className="text-4xl font-bold text-rose-400">{fmt(product.price)}</span>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="font-semibold text-white mb-2">About this product</h3>
              <p className="text-stone-400 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock */}
            <div className="mt-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-stone-400" />
              <span className={`text-sm font-medium ${product.stockCount > 0 ? 'text-sage-400' : 'text-red-400'}`}>
                {product.stockCount > 0 ? `${product.stockCount} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            {product.stockCount > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-stone-400 text-sm">Quantity:</span>
                  <div className="flex items-center gap-1 bg-white/5 rounded-xl border border-white/10">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:text-rose-400 transition-colors font-bold">−</button>
                    <span className="px-4 py-2 font-semibold text-white min-w-[3rem] text-center">{qty}</span>
                    <button onClick={() => setQty(Math.min(product.stockCount, qty + 1))} className="px-3 py-2 hover:text-rose-400 transition-colors font-bold">+</button>
                  </div>
                </div>
                <button
                  onClick={handleAdd}
                  id="add-to-cart-btn"
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    added ? 'bg-green-500 text-white' : 'btn-primary'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {added ? '✓ Added to Cart!' : `Add ${qty > 1 ? `${qty} ` : ''}to Cart`}
                </button>
              </div>
            )}

            {/* Perks */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Over ₹2,000' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '15 days' },
                { icon: Package, label: 'Secure Pack', sub: 'Gift ready' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="glass-card p-3 text-center">
                  <Icon className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                  <p className="text-white text-xs font-semibold">{label}</p>
                  <p className="text-stone-500 text-xs">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
