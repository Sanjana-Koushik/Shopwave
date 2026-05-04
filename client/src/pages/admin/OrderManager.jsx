import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../services/api';
import Spinner from '../../components/ui/Spinner';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const statusColors = {
  pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  processing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  delivered: 'bg-sage-500/20 text-sage-300 border-sage-500/30',
  cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    getOrders().then(({ data }) => {
      setOrders(data.orders);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    } catch { /* no-op */ } finally { setUpdating(null); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="section-title">Order Manager</h1>
          <p className="text-stone-400 mt-1">{orders.length} total orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-stone-400">No orders yet. Place a test order from the storefront!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="glass-card overflow-hidden">
                <div
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 cursor-pointer hover:bg-white/3 transition-colors"
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-stone-400">{order._id.slice(-12)}</span>
                      <span className={`badge border ${statusColors[order.status]}`}>{order.status}</span>
                    </div>
                    <p className="text-white font-medium mt-1">{order.shipping?.fullName}</p>
                    <p className="text-stone-500 text-xs">{order.shipping?.city}, {order.shipping?.state}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-rose-400 font-bold">{fmt(order.total)}</p>
                      <p className="text-stone-500 text-xs">{order.items?.length} item(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-stone-400 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded === order._id && (
                  <div className="border-t border-white/10 p-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Items */}
                      <div>
                        <p className="text-stone-400 text-xs uppercase font-semibold tracking-wide mb-3">Order Items</p>
                        <div className="space-y-2">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/3 rounded-lg p-2">
                              {item.imageUrl && (
                                <img src={item.imageUrl} alt={item.name} className="w-10 h-12 object-cover rounded" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium line-clamp-1">{item.name}</p>
                                <p className="text-stone-400 text-xs">Qty: {item.quantity} × {fmt(item.price)}</p>
                              </div>
                              <p className="text-rose-400 text-sm font-semibold">{fmt(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping + Status update */}
                      <div>
                        <p className="text-stone-400 text-xs uppercase font-semibold tracking-wide mb-3">Shipping Details</p>
                        <div className="bg-white/3 rounded-xl p-3 text-sm space-y-1 mb-4">
                          <p className="text-white font-medium">{order.shipping?.fullName}</p>
                          <p className="text-stone-400">{order.shipping?.email}</p>
                          <p className="text-stone-400">{order.shipping?.address}</p>
                          <p className="text-stone-400">{order.shipping?.city}, {order.shipping?.state} {order.shipping?.postalCode}</p>
                        </div>

                        <p className="text-stone-400 text-xs uppercase font-semibold tracking-wide mb-2">Update Status</p>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updating === order._id}
                          className="input-field text-sm"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                        {updating === order._id && <p className="text-stone-400 text-xs mt-2">Updating...</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManager;
