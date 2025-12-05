// components/ProductGrid.jsx
import ProductCard from "./ProductCard";

export default function ProductGrid({ items, onQuickView, onAdd, onProductClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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