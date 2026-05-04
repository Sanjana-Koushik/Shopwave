import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import Spinner from '../components/ui/Spinner';
import { ChevronRight, Lock, Truck, CheckCircle } from 'lucide-react';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const steps = ['Cart', 'Shipping', 'Review'];

const Checkout = () => {
  const { items, subtotal, shippingCost, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', state: '', postalCode: '', country: 'India',
  });

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validateStep1 = () => {
    const required = ['fullName', 'email', 'address', 'city', 'state', 'postalCode'];
    const missing = required.filter((k) => !form[k].trim());
    if (missing.length) { setError('Please fill all required fields.'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Invalid email address.'); return false; }
    setError(''); return true;
  };

  const placeOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        items: items.map((i) => ({ product: i._id, name: i.name, price: i.price, quantity: i.quantity, imageUrl: i.imageUrl })),
        shipping: form,
        subtotal,
        shippingCost,
        total,
      };
      const { data } = await createOrder(payload);
      clearCart();
      navigate('/order-success', { state: { order: data.order } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step < 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16 gap-4">
        <p className="text-stone-400">Your cart is empty.</p>
        <button onClick={() => navigate('/products')} className="btn-primary">Shop Now</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container max-w-5xl">
        <h1 className="section-title mb-2">Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? 'bg-rose-500 text-white' : i === step ? 'bg-white/10 border-2 border-rose-500 text-rose-400' : 'bg-white/5 text-stone-500'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium ${i <= step ? 'text-white' : 'text-stone-500'}`}>{s}</span>
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-stone-600 ml-1" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="glass-card p-6 animate-fade-in">
                <h2 className="font-bold text-white text-lg mb-5 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-rose-400" /> Shipping Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name *', name: 'fullName', placeholder: 'Priya Sharma', col: 2 },
                    { label: 'Email Address *', name: 'email', placeholder: 'priya@email.com', type: 'email' },
                    { label: 'Phone Number', name: 'phone', placeholder: '+91 98765 43210' },
                    { label: 'Street Address *', name: 'address', placeholder: '12, MG Road', col: 2 },
                    { label: 'City *', name: 'city', placeholder: 'Bangalore' },
                    { label: 'State *', name: 'state', placeholder: 'Karnataka' },
                    { label: 'Postal Code *', name: 'postalCode', placeholder: '560001' },
                    { label: 'Country', name: 'country', placeholder: 'India' },
                  ].map(({ label, name, placeholder, type = 'text', col }) => (
                    <div key={name} className={col === 2 ? 'sm:col-span-2' : ''}>
                      <label className="block text-stone-400 text-xs font-semibold uppercase tracking-wide mb-1">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={form[name]}
                        onChange={update}
                        placeholder={placeholder}
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>
                {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                <button
                  onClick={() => { if (validateStep1()) setStep(2); }}
                  className="btn-primary mt-6 w-full"
                >
                  Continue to Review
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="glass-card p-6 animate-fade-in">
                <h2 className="font-bold text-white text-lg mb-5">Review Your Order</h2>
                {/* Shipping summary */}
                <div className="bg-white/5 rounded-xl p-4 mb-5">
                  <p className="text-stone-400 text-xs uppercase font-semibold tracking-wide mb-2">Shipping to</p>
                  <p className="text-white font-medium">{form.fullName}</p>
                  <p className="text-stone-400 text-sm">{form.address}, {form.city}, {form.state} {form.postalCode}</p>
                  <p className="text-stone-400 text-sm">{form.email}</p>
                  <button onClick={() => setStep(1)} className="text-rose-400 text-xs mt-2 hover:text-rose-300">Edit</button>
                </div>
                {/* Items */}
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-14 object-cover rounded-lg bg-warm-700 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-stone-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-rose-400 font-semibold text-sm">{fmt(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                {/* Mock payment note */}
                <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-5">
                  <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-300 text-sm">This is a mock checkout — no real payment is processed. Click "Place Order" to simulate a successful purchase.</p>
                </div>
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
                  id="place-order-btn"
                >
                  {loading ? <Spinner size="sm" /> : <CheckCircle className="w-5 h-5" />}
                  {loading ? 'Placing Order...' : `Place Order • ${fmt(total)}`}
                </button>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-5 sticky top-24">
              <h3 className="font-bold text-white mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-sage-400' : ''}>{shippingCost === 0 ? 'FREE' : fmt(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-base pt-3 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-rose-400">{fmt(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
