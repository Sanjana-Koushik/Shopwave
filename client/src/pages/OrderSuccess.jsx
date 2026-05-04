import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="max-w-lg w-full glass-card p-8 text-center animate-slide-up">
        {/* Success icon */}
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="font-display text-3xl font-bold text-white mb-2">Order Placed! 🎉</h1>
        <p className="text-stone-400 mb-6">
          Thank you for shopping with ShopWave! Your order has been successfully placed and will be processed shortly.
        </p>

        {order && (
          <div className="bg-white/5 rounded-xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">Order ID</span>
              <span className="text-white font-mono font-medium text-xs">{order._id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">Status</span>
              <span className="text-amber-400 font-semibold capitalize">{order.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">Items</span>
              <span className="text-white">{order.items?.length} item(s)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">Total Paid</span>
              <span className="text-rose-400 font-bold">{fmt(order.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">Shipping to</span>
              <span className="text-white text-right">{order.shipping?.fullName}, {order.shipping?.city}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="btn-secondary flex items-center justify-center gap-2 flex-1">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/products" className="btn-primary flex items-center justify-center gap-2 flex-1" id="continue-shopping-btn">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-stone-500">
          <Package className="w-4 h-4" />
          <span>A confirmation has been noted in your order history.</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
