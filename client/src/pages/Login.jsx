import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Lock, Eye, EyeOff, ShoppingBag } from 'lucide-react';
import Spinner from '../components/ui/Spinner';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/home');
    }
  }, [user, navigate]);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-hero-gradient">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cream-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <Sparkles className="w-7 h-7 text-rose-400" />
          <span className="font-display text-2xl font-bold text-gradient">ShopWave</span>
        </div>

        {/* Middle copy */}
        <div className="relative z-10">
          <h2 className="font-display text-5xl font-bold text-white leading-tight mb-6">
            Where Style<br />
            <span className="text-gradient">Meets Soul</span>
          </h2>
          <p className="text-stone-300 text-lg leading-relaxed mb-10 max-w-md">
            Discover handpicked fashion, lovingly crafted crochet, and books that inspire — all curated for the mindful shopper.
          </p>

          {/* Category pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: '👗 Fashion', color: 'bg-rose-500/20 border-rose-500/40 text-rose-300' },
              { label: '🧶 Crochet', color: 'bg-sage-500/20 border-sage-500/40 text-sage-300' },
              { label: '📚 Books', color: 'bg-cream-500/20 border-cream-500/40 text-cream-300' },
            ].map(({ label, color }) => (
              <span key={label} className={`px-4 py-2 rounded-full border text-sm font-medium ${color}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="flex gap-10 relative z-10">
          {[['500+', 'Products'], ['10K+', 'Happy Shoppers'], ['4.9★', 'Avg Rating']].map(([val, label]) => (
            <div key={label}>
              <p className="text-2xl font-bold text-white">{val}</p>
              <p className="text-stone-400 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <Sparkles className="w-6 h-6 text-rose-400" />
            <span className="font-display text-2xl font-bold text-gradient">ShopWave</span>
          </div>

          <div className="glass-card p-8 animate-slide-up">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-7 h-7 text-rose-400" />
              </div>
              <h1 className="font-display text-3xl font-bold text-white">Welcome back</h1>
              <p className="text-stone-400 mt-2 text-sm">Sign in to continue shopping</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-stone-400 text-xs font-semibold uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  placeholder="you@example.com"
                  className="input-field"
                  id="login-email"
                  required
                  autoFocus
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-stone-400 text-xs font-semibold uppercase tracking-wide">
                    Password
                  </label>
                  <button type="button" className="text-xs text-rose-400 hover:text-rose-300 transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={update}
                    placeholder="••••••••"
                    className="input-field pr-10"
                    id="login-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base"
                id="login-submit-btn"
              >
                {loading ? <Spinner size="sm" /> : <Lock className="w-4 h-4" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Signup Link */}
            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-stone-400 text-sm mb-4">
                Don't have an account?{' '}
                <Link to="/signup" className="text-rose-400 hover:text-rose-300 transition-colors font-medium">
                  Sign up
                </Link>
              </p>
              
              {/* Admin hint */}
              <p className="text-stone-500 text-xs">
                Admin access?{' '}
                <span className="text-stone-400">
                  admin@shopwave.com / admin123
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
