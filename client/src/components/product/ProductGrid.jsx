import ProductCard from './ProductCard';
import Spinner from '../ui/Spinner';
import { PackageX } from 'lucide-react';

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Spinner size="lg" />
        <p className="text-stone-400 animate-pulse">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
          <PackageX className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-red-400 font-medium">{error}</p>
        <p className="text-stone-500 text-sm">Make sure your backend server is running on port 5000.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
          <PackageX className="w-8 h-8 text-stone-400" />
        </div>
        <p className="text-stone-300 font-medium">No products found</p>
        <p className="text-stone-500 text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
