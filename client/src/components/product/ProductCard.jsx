import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';

const categoryColors = {
  Fashion: 'badge-fashion',
  Crochet: 'badge-crochet',
  Books: 'badge-books',
};

const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-600'}`}
      />
    ))}
  </div>
);

const ProductCard = ({ product }) => {
  const { addItem, openDrawer } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    openDrawer();
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glass hover:border-white/20">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-warm-700">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
            className="absolute top-3 right-3 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-500/80"
            aria-label="Add to wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-400 text-rose-400' : 'text-white'}`} />
          </button>

          {/* Featured badge */}
          {product.featured && (
            <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}

          {/* Out of stock */}
          {product.stockCount === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-black/50 px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}

          {/* Add to cart hover button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stockCount === 0}
            className={`absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 ${
              addedAnim
                ? 'bg-green-500 text-white'
                : 'bg-white/90 text-warm-900 hover:bg-white'
            } disabled:opacity-50`}
          >
            <ShoppingCart className="w-4 h-4" />
            {addedAnim ? 'Added!' : 'Add to Cart'}
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <span className={categoryColors[product.category] || 'badge bg-stone-700 text-stone-300'}>
            {product.category}
          </span>
          <h3 className="font-semibold text-white mt-2 line-clamp-1 group-hover:text-rose-300 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Stars rating={product.rating || 4} />
            <span className="text-stone-500 text-xs">({product.numReviews || 0})</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-rose-400 font-bold text-lg">{formattedPrice}</span>
            <span className={`text-xs ${product.stockCount > 0 ? 'text-sage-400' : 'text-red-400'}`}>
              {product.stockCount > 0 ? `${product.stockCount} left` : 'Sold out'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
