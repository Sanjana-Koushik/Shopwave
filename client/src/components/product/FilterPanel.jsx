import { Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = ['Fashion', 'Crochet', 'Books'];

const FilterPanel = ({ params, setParams }) => {
  const updateParam = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setParams({ page: 1 });
  };

  const hasFilters = params.search || params.category || params.minPrice || params.maxPrice;

  return (
    <div className="glass-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-rose-400" />
          <span className="font-semibold text-white">Filters</span>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={params.search || ''}
          onChange={(e) => updateParam('search', e.target.value)}
          className="input-field pl-9 text-sm"
          id="search-input"
        />
      </div>

      {/* Category */}
      <div>
        <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-3">Category</p>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam('category', params.category === cat ? '' : cat)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                params.category === cat
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-stone-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                cat === 'Fashion' ? 'bg-rose-400' : cat === 'Crochet' ? 'bg-sage-400' : 'bg-cream-400'
              }`} />
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-3">Price Range (₹)</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={params.minPrice || ''}
            onChange={(e) => updateParam('minPrice', e.target.value)}
            className="input-field text-sm py-2"
          />
          <input
            type="number"
            placeholder="Max"
            value={params.maxPrice || ''}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
            className="input-field text-sm py-2"
          />
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {[{ l: 'Under ₹500', min: '', max: 500 }, { l: '₹500–₹1500', min: 500, max: 1500 }, { l: '₹1500+', min: 1500, max: '' }].map(
            ({ l, min, max }) => (
              <button
                key={l}
                onClick={() => setParams((p) => ({ ...p, minPrice: min, maxPrice: max, page: 1 }))}
                className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-stone-400 hover:text-white transition-all"
              >
                {l}
              </button>
            )
          )}
        </div>
      </div>

      {/* Featured toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={params.featured === 'true'}
              onChange={(e) => updateParam('featured', e.target.checked ? 'true' : '')}
              className="sr-only"
            />
            <div className={`w-10 h-5 rounded-full transition-colors ${params.featured === 'true' ? 'bg-rose-500' : 'bg-white/10'}`}>
              <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${params.featured === 'true' ? 'translate-x-5 ml-0' : 'translate-x-0.5'}`} />
            </div>
          </div>
          <span className="text-sm text-stone-300 group-hover:text-white transition-colors">Featured only</span>
        </label>
      </div>
    </div>
  );
};

export default FilterPanel;
