import { Link } from 'react-router-dom';
import { Sparkles, Globe, Mail, MessageCircle, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-warm-800/60 border-t border-white/10 mt-20">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span className="font-display text-lg font-bold text-gradient">ShopWave</span>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed">
              Curated fashion, handcrafted crochet, and inspiring books — all in one beautiful place.
            </p>
            <div className="flex gap-3 mt-4">
              {[Globe, Mail, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all border border-white/10 hover:border-rose-500/40">
                  <Icon className="w-4 h-4 text-stone-400 hover:text-rose-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2">
              {['Fashion', 'Crochet', 'Books', 'New Arrivals', 'Sale'].map((item) => (
                <li key={item}>
                  <Link to={`/products?category=${item}`} className="text-stone-400 hover:text-white text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-white mb-4">Help</h4>
            <ul className="space-y-2">
              {['Shipping & Returns', 'Size Guide', 'Care Instructions', 'FAQs', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-stone-400 hover:text-white text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Stay in the loop</h4>
            <p className="text-stone-400 text-sm mb-3">Get early access to new arrivals and exclusive offers.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="input-field text-sm py-2 flex-1"
              />
              <button className="btn-primary py-2 px-4 text-sm whitespace-nowrap">Join</button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 text-sm">© 2024 ShopWave. All rights reserved.</p>
          <p className="text-stone-500 text-sm flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
