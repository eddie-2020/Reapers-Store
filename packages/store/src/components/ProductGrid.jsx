
import ProductCard from "./ProductCard";

export default function ProductGrid({ items, onQuickView, onAdd, onProductClick, loading, emptyMessage = "No products found." }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-80" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-500 font-medium text-lg">{emptyMessage}</p>
        <p className="text-gray-400 text-sm mt-1">Check back later for new arrivals.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
      {items.map((p) => (
        <ProductCard
          key={p.id}
          p={p}
          onQuickView={onQuickView}
          onAdd={onAdd}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
}