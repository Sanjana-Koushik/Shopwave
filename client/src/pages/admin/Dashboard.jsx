import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getOrders } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Package, ShoppingBag, TrendingUp, Users, ArrowRight, LogOut } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([getProducts({ limit: 100 }), getOrders()]);
        const products = prodRes.data.products;
        const orders = orderRes.data.orders;

        setStats({
          totalProducts: prodRes.data.total,
          totalOrders: orders.length,
          totalRevenue: orders.reduce((s, o) => s + o.total, 0),
          pendingOrders: orders.filter((o) => o.status === 'pending').length,
          fashionCount: products.filter((p) => p.category === 'Fashion').length,
          crochetCount: products.filter((p) => p.category === 'Crochet').length,
          booksCount: products.filter((p) => p.category === 'Books').length,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <Spinner size="lg" />
    </div>
  );

  const statCards = [
    { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: Package, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: ShoppingBag, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Revenue', value: fmt(stats?.totalRevenue ?? 0), icon: TrendingUp, color: 'text-sage-400', bg: 'bg-sage-500/10' },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p className="text-stone-400 mt-1">Welcome back, {user?.name} 👋</p>
          </div>
          <button onClick={logout} className="btn-secondary flex items-center gap-2 text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="glass-card p-5">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-stone-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { cat: 'Fashion', count: stats?.fashionCount, color: 'bg-rose-500', pct: Math.round((stats?.fashionCount / stats?.totalProducts) * 100) || 0 },
            { cat: 'Crochet', count: stats?.crochetCount, color: 'bg-sage-500', pct: Math.round((stats?.crochetCount / stats?.totalProducts) * 100) || 0 },
            { cat: 'Books', count: stats?.booksCount, color: 'bg-cream-500', pct: Math.round((stats?.booksCount / stats?.totalProducts) * 100) || 0 },
          ].map(({ cat, count, color, pct }) => (
            <div key={cat} className="glass-card p-5">
              <div className="flex justify-between mb-3">
                <span className="text-white font-medium">{cat}</span>
                <span className="text-stone-400 text-sm">{count} products</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className={`${color} h-2 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-stone-500 text-xs mt-1">{pct}% of catalog</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <Link to="/admin/products" className="glass-card p-6 hover:border-white/20 transition-all group flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-lg">Manage Products</p>
              <p className="text-stone-400 text-sm mt-1">Add, edit, or delete products</p>
            </div>
            <ArrowRight className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/admin/orders" className="glass-card p-6 hover:border-white/20 transition-all group flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-lg">View Orders</p>
              <p className="text-stone-400 text-sm mt-1">Track and manage customer orders</p>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Recent orders */}
        {recentOrders.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="font-bold text-white text-lg mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-stone-500 border-b border-white/10">
                    <th className="text-left pb-3 font-medium">Order ID</th>
                    <th className="text-left pb-3 font-medium">Customer</th>
                    <th className="text-left pb-3 font-medium">Total</th>
                    <th className="text-left pb-3 font-medium">Status</th>
                    <th className="text-left pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-white/3 transition-colors">
                      <td className="py-3 font-mono text-xs text-stone-400">{o._id.slice(-8)}...</td>
                      <td className="py-3 text-white">{o.shipping?.fullName}</td>
                      <td className="py-3 text-rose-400 font-semibold">{fmt(o.total)}</td>
                      <td className="py-3">
                        <span className={`badge ${o.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-sage-500/20 text-sage-300'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 text-stone-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
