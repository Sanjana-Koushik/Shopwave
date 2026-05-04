import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const CartItem = ({ item }) => {
  const { updateQty, removeItem } = useCart();
  return (
    <div className="flex gap-3 py-3 border-b border-white/10">
      <img src={item.imageUrl} alt={item.name} className="w-16 h-20 object-cover rounded-lg bg-warm-700 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm line-clamp-2">{item.name}</p>
        <p className="text-rose-400 font-bold mt-1">{fmt(item.price)}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 bg-white/5 rounded-lg border border-white/10">
            <button onClick={() => updateQty(item._id, item.quantity - 1)} className="p-1.5 hover:text-rose-400 transition-colors">
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-sm font-medium min-w-[1.5rem] text-center">{item.quantity}</span>
            <button onClick={() => updateQty(item._id, item.quantity + 1)} className="p-1.5 hover:text-rose-400 transition-colors">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <button onClick={() => removeItem(item._id)} className="text-stone-500 hover:text-red-400 transition-colors p-1">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CartDrawer = () => {
  const { items, isOpen, closeDrawer, itemCount, subtotal, shippingCost, total, clearCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={closeDrawer} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-warm-800/95 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col transition-transform duration-350 ease-out ${
          isOpen ? 'translate-x-0 animate-slide-in-right' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-400" />
            <h2 className="font-display text-lg font-bold text-white">Your Cart</h2>
            {itemCount > 0 && (
              <span className="bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={clearCart} className="text-xs text-stone-500 hover:text-red-400 transition-colors">
                Clear all
              </button>
            )}
            <button onClick={closeDrawer} className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all" aria-label="Close cart">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-stone-500" />
              </div>
              <div>
                <p className="text-white font-semibold">Your cart is empty</p>
                <p className="text-stone-400 text-sm mt-1">Add some beautiful items to get started!</p>
              </div>
              <button onClick={closeDrawer} className="btn-outline text-sm py-2 px-5">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'text-sage-400 font-medium' : ''}>
                  {shippingCost === 0 ? 'FREE' : fmt(shippingCost)}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-stone-500">Free shipping on orders over ₹2,000</p>
              )}
              <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-rose-400">{fmt(total)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              onClick={closeDrawer}
              className="btn-primary w-full text-center block"
              id="checkout-btn"
            >
              Proceed to Checkout
            </Link>
            <button onClick={closeDrawer} className="btn-secondary w-full text-sm py-2.5">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
