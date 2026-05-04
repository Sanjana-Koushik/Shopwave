import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Package, BookOpen, Scissors } from 'lucide-react';
import useProducts from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';

const categories = [
  {
    name: 'Fashion',
    icon: Sparkles,
    desc: 'Curated styles for every occasion',
    color: 'from-rose-500/20 to-pink-600/10',
    border: 'border-rose-500/30',
    textColor: 'text-rose-400',
    query: 'Fashion',
  },
  {
    name: 'Crochet',
    icon: Scissors,
    desc: 'Handcrafted with love',
    color: 'from-sage-500/20 to-green-600/10',
    border: 'border-sage-500/30',
    textColor: 'text-sage-400',
    query: 'Crochet',
  },
  {
    name: 'Books',
    icon: BookOpen,
    desc: 'Stories that inspire & delight',
    color: 'from-cream-500/20 to-amber-600/10',
    border: 'border-cream-500/30',
    textColor: 'text-cream-400',
    query: 'Books',
  },
];

const Home = () => {
  const { products: featuredProducts, loading, error } = useProducts({ featured: 'true', limit: 8 });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-hero-gradient">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-pink-800/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cream-600/10 rounded-full blur-3xl" />
        </div>

        <div className="page-container relative z-10 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span className="text-rose-300 text-sm font-medium">New arrivals every week</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight animate-slide-up">
              Where Style
              <br />
              <span className="text-gradient">Meets Soul</span>
            </h1>

            <p className="text-stone-300 text-lg md:text-xl mt-6 max-w-xl leading-relaxed animate-fade-in">
              Discover handpicked fashion, lovingly crafted crochet, and books that inspire — all curated for the mindful shopper.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-slide-up">
              <Link to="/products" className="btn-primary flex items-center gap-2 justify-center group" id="hero-shop-btn">
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/products?featured=true" className="btn-secondary flex items-center gap-2 justify-center">
                <Sparkles className="w-4 h-4" /> Featured Picks
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-14 animate-fade-in">
              {[['500+', 'Products'], ['10K+', 'Happy Shoppers'], ['4.9★', 'Avg Rating']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{val}</p>
                  <p className="text-stone-400 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-20 bg-warm-900">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">Shop by Category</h2>
            <p className="text-stone-400 mt-3 max-w-md mx-auto">
              Explore our three carefully curated collections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(({ name, icon: Icon, desc, color, border, textColor, query }) => (
              <Link
                key={name}
                to={`/products?category=${query}`}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} border ${border} p-8 hover:-translate-y-1 transition-all duration-300 hover:shadow-glass`}
              >
                <div className={`w-12 h-12 ${textColor} bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{name}</h3>
                <p className="text-stone-400 text-sm mt-1">{desc}</p>
                <div className={`flex items-center gap-1 mt-4 text-sm font-medium ${textColor}`}>
                  Explore {name} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/3 rounded-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-warm-800/30">
        <div className="page-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="text-stone-400 mt-2">Handpicked just for you</p>
            </div>
            <Link
              to="/products?featured=true"
              className="hidden md:flex items-center gap-2 text-rose-400 hover:text-rose-300 font-medium transition-colors group"
            >
              View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} loading={loading} error={error} />

          <div className="text-center mt-10 md:hidden">
            <Link to="/products" className="btn-outline">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Value Props Banner */}
      <section className="py-16 bg-warm-900">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders over ₹2,000' },
              { icon: '↩️', title: 'Easy Returns', desc: '15-day hassle-free returns' },
              { icon: '🔒', title: 'Secure Payment', desc: '100% safe & encrypted' },
              { icon: '🎁', title: 'Gift Wrapping', desc: 'Available at checkout' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center glass-card p-6 hover:border-white/20 transition-all">
                <div className="text-3xl mb-3">{icon}</div>
                <p className="font-semibold text-white text-sm">{title}</p>
                <p className="text-stone-500 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
