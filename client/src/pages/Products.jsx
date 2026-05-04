import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import FilterPanel from '../components/product/FilterPanel';
import useProducts from '../hooks/useProducts';
import { SlidersHorizontal, X } from 'lucide-react';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const initialParams = {
    category: searchParams.get('category') || '',
    featured: searchParams.get('featured') || '',
    search: searchParams.get('search') || '',
    page: 1,
    limit: 12,
  };

  const { products, loading, error, total, params, setParams } = useProducts(initialParams);

  // Sync URL params when they change
  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      category: searchParams.get('category') || '',
      featured: searchParams.get('featured') || '',
      page: 1,
    }));
  }, [searchParams]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="section-title">
            {params.category ? `${params.category} Collection` : 'All Products'}
          </h1>
          <p className="text-stone-400 mt-2">
            {loading ? 'Loading...' : `${total} product${total !== 1 ? 's' : ''} found`}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel params={params} setParams={setParams} />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter button */}
            <div className="lg:hidden mb-4 flex items-center gap-3">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="flex items-center gap-2 btn-secondary text-sm py-2 px-4"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              {(params.category || params.search || params.minPrice || params.maxPrice) && (
                <button
                  onClick={() => setParams({ page: 1, limit: 12 })}
                  className="flex items-center gap-1 text-sm text-rose-400 hover:text-rose-300"
                >
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>

            <ProductGrid products={products} loading={loading} error={error} />

            {/* Pagination */}
            {!loading && products.length > 0 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => setParams((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                  disabled={params.page <= 1}
                  className="btn-secondary py-2 px-4 text-sm disabled:opacity-30"
                >
                  Previous
                </button>
                <span className="flex items-center text-stone-400 text-sm px-4">
                  Page {params.page}
                </span>
                <button
                  onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
                  disabled={products.length < (params.limit || 12)}
                  className="btn-secondary py-2 px-4 text-sm disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilter && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowMobileFilter(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-warm-800 rounded-t-3xl border-t border-white/10 p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Filters</h3>
              <button onClick={() => setShowMobileFilter(false)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel params={params} setParams={(fn) => { setParams(fn); setShowMobileFilter(false); }} />
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
