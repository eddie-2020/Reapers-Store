import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const {
    cart,
    open,
    closeCart,
    addToCart,
    removeOne,
    removeItem,
    clearCart,
    subtotal
  } = useCart();

  return (
    <>
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transition-transform duration-300 z-50 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Your Shopping Bag</h3>
              <p className="text-sm text-gray-500">{Object.keys(cart).length} items</p>
            </div>
            <button onClick={closeCart} className="p-2 rounded hover:bg-gray-100">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {Object.keys(cart).length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🛒</div>
                <p className="text-gray-500 mb-2">Your cart is empty</p>
                <p className="text-sm text-gray-400">Add some items to get started</p>
              </div>
            ) : (
              Object.values(cart).map(item => (
                <div key={item.id} className="flex items-start gap-4 mb-6 pb-6 border-b">
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 truncate">{item.title}</div>
                    <div className="text-sm text-gray-600">₦{item.price.toLocaleString()}</div>
                    {item.selectedSize && <div className="text-xs text-gray-500">Size: {item.selectedSize}</div>}
                    {item.selectedColor && <div className="text-xs text-gray-500">Color: {item.selectedColor}</div>}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border rounded-lg">
                        <button onClick={() => removeOne(item.id)} className="px-3 py-1">-</button>
                        <div className="px-3 py-1 text-sm font-medium">{item.qty}</div>
                        <button onClick={() => addToCart(item, 1)} className="px-3 py-1">+</button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="font-semibold">₦{(item.qty * item.price).toLocaleString()}</div>
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">🗑️</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-700">Subtotal</span>
              <span className="font-bold text-lg">₦{subtotal.toLocaleString()}</span>
            </div>

            <p className="text-xs text-gray-500 text-center mb-4">Shipping & taxes calculated at checkout</p>

            <button disabled={Object.keys(cart).length === 0} className="w-full py-3.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 mb-3 disabled:opacity-50">
              Proceed to Checkout
            </button>

            {Object.keys(cart).length > 0 && (
              <button onClick={clearCart} className="w-full py-3 border border-gray-300 rounded-lg font-medium text-gray-700">
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {open && <div className="fixed inset-0 bg-black/20 z-40" onClick={closeCart} />}
    </>
  );
}
