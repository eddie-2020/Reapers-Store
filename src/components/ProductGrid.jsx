// import ProductCard from "./ProductCard";

// export default function ProductGrid({ items, onQuickView, onAdd }) {
//   return (
//     <div className="max-w-7xl mx-auto px-6 py-12">
//       <div className="text-center mb-12">
//         <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Premium Collection</h1>
//         <p className="text-gray-600 max-w-2xl mx-auto">Discover our exclusive range of premium fashion pieces crafted with exceptional quality and attention to detail.</p>
//       </div>
      
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//         {items.map((p) => (
//           <ProductCard
//             key={p.id}
//             p={p}
//             onQuickView={onQuickView}
//             onAdd={onAdd}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// components/ProductGrid.jsx
// import ProductCard from "./ProductCard";

// export default function ProductGrid({ items, onQuickView, onAdd, onProductClick }) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//       {items.map((p) => (
//         <ProductCard
//           key={p.id}
//           p={p}
//           onQuickView={onQuickView}
//           onAdd={onAdd}
//           onProductClick={onProductClick}
//         />
//       ))}
//     </div>
//   );
// }

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