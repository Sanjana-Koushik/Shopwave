import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { itemCount, openDrawer } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/products?category=Fashion', label: 'Fashion' },
    { to: '/products?category=Crochet', label: 'Crochet' },
    { to: '/products?category=Books', label: 'Books' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-warm-900/90 backdrop-blur-md border-b border-white/10">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 group">
            <Sparkles className="w-6 h-6 text-rose-400 group-hover:text-rose-300 transition-colors" />
            <span className="font-display text-xl font-bold text-gradient">ShopWave</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `nav-link text-sm ${isActive && l.to !== '/products?category=Fashion' ? 'text-white after:w-full' : ''}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors px-3 py-1.5 rounded-lg border border-amber-500/30 hover:border-amber-500/60"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={logout}
                className="hidden md:block text-sm text-stone-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden md:block text-sm text-stone-400 hover:text-white transition-colors"
              >
                Login
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={openDrawer}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
              id="cart-btn"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5 text-stone-200" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse-soft">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-warm-800/95 backdrop-blur-lg border-t border-white/10 animate-fade-in">
          <div className="page-container py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-4 py-3 text-stone-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t border-white/10 mt-2 pt-2">
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-amber-400" onClick={() => setMobileOpen(false)}>
                  <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                </Link>
              )}
              {user ? (
                <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left px-4 py-3 text-stone-400">
                  Logout ({user.name})
                </button>
              ) : (
                <Link to="/login" className="block px-4 py-3 text-stone-400" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
