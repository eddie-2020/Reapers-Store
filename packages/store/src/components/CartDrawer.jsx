import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useCart } from "../context/useCart";
import { FiTrash } from "react-icons/fi";

export default function CartDrawer() {
  const navigate = useNavigate();
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

  const [view, setView] = useState('cart'); // 'cart', 'billing', 'review'
  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };

  const config = {
    reference: (new Date()).getTime().toString(),
    email: billingInfo.email,
    amount: subtotal * 100,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: "Full Name",
          variable_name: "full_name",
          value: billingInfo.fullName
        },
        {
          display_name: "Phone Number",
          variable_name: "phone",
          value: billingInfo.phone
        },
        {
          display_name: "Delivery Address",
          variable_name: "address",
          value: `${billingInfo.address}, ${billingInfo.city}, ${billingInfo.state}`
        }
      ]
    }
  };

  const onSuccess = async (reference) => {
    // 1. Prepare Order Payload
    const orderData = {
      fullName: billingInfo.fullName,
      email: billingInfo.email,
      phone: billingInfo.phone,
      address: billingInfo.address,
      city: billingInfo.city,
      state: billingInfo.state,
      amount: subtotal, // Store raw amount
      reference: reference.reference,
      items: Object.values(cart).map(item => ({
        product_name: item.title,
        quantity: item.qty,
        price: item.price,
        size: item.selectedSize || null,
        color: item.selectedColor || null,
        image: item.image || null
      }))
    };

    try {
      // 2. Send to Backend
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/orders/create/`, orderData);

      alert("Payment Successful! Order placed.");

      // 3. Clear cart and state
      clearCart();
      setView('cart');
      setBillingInfo({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: ""
      });

      // 4. Close and redirect
      closeCart();
      navigate('/');

    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Payment successful but failed to record order. Please contact support with ref: " + reference.reference);
      // Still close and clear or keep open? Usually better to fail safe for user but log error.
      // For now, let's treat it as success from user perspective but warn.
      closeCart();
      navigate('/');
    }
  };

  const onClose = () => {
    console.log('closed');
  }

  const initializePayment = usePaystackPayment(config);

  const handleCheckoutClick = () => {
    setView('billing');
  };

  const handleBillingSubmit = (e) => {
    e.preventDefault();
    if (!billingInfo.fullName || !billingInfo.email || !billingInfo.phone || !billingInfo.address || !billingInfo.city || !billingInfo.state) {
      alert("Please fill in all fields");
      return;
    }
    setView('review');
  };

  const handleBackToCart = () => {
    setView('cart');
  };

  const handleBackToBilling = () => {
    setView('billing');
  };

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transition-transform duration-300 z-50 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">
                {view === 'cart' && "Your Shopping Bag"}
                {view === 'billing' && "Billing Information"}
                {view === 'review' && "Review Order"}
              </h3>
              {view === 'cart' && <p className="text-sm text-gray-500">{Object.keys(cart).length} items</p>}
              {view !== 'cart' && <p className="text-sm text-gray-500">Step {view === 'billing' ? '1' : '2'} of 2</p>}
            </div>
            <button onClick={closeCart} className="p-2 rounded hover:bg-gray-100 cursor-pointer">✕</button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* CART VIEW */}
            {view === 'cart' && (
              <>
                {Object.keys(cart).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🛒</div>
                    <p className="text-gray-500 mb-2">Your cart is empty</p>
                    <p className="text-sm text-gray-400">Add some items to get started</p>
                  </div>
                ) : (
                  Object.values(cart).map(item => (
                    <div key={item.id} className="flex items-start gap-4 mb-6 pb-6 border-b">
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg shrink-0" />
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
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors duration-200 cursor-pointer"
                            >
                              <FiTrash size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* BILLING VIEW */}
            {view === 'billing' && (
              <form id="billing-form" onSubmit={handleBillingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    required
                    name="fullName"
                    value={billingInfo.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={billingInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={billingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="08012345678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    required
                    name="address"
                    value={billingInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      required
                      name="city"
                      value={billingInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Lagos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      required
                      name="state"
                      value={billingInfo.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Lagos State"
                    />
                  </div>
                </div>
              </form>
            )}

            {/* REVIEW VIEW */}
            {view === 'review' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Billing Details</h4>
                  <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-medium">{billingInfo.fullName}</span>

                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">{billingInfo.email}</span>

                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium">{billingInfo.phone}</span>

                    <span className="text-gray-500">Address:</span>
                    <span className="font-medium">
                      {billingInfo.address}<br />
                      {billingInfo.city}, {billingInfo.state}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Order Summary</h4>
                  <div className="space-y-2">
                    {Object.values(cart).map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.qty}x {item.title}</span>
                        <span className="font-medium">₦{(item.qty * item.price).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t font-bold text-gray-900 mt-2">
                      <span>Total</span>
                      <span>₦{subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="p-6 border-t bg-gray-50">
            {view === 'cart' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-700">Subtotal</span>
                  <span className="font-bold text-lg">₦{subtotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 text-center mb-4">Shipping & taxes calculated at checkout</p>
                <button
                  onClick={handleCheckoutClick}
                  disabled={Object.keys(cart).length === 0}
                  className="w-full py-3.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 mb-3 disabled:opacity-50 cursor-pointer"
                >
                  Checkout
                </button>
              </>
            )}

            {view === 'billing' && (
              <div className="space-y-3">
                <button
                  type="submit"
                  form="billing-form"
                  className="w-full py-3.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 cursor-pointer"
                >
                  Review Order
                </button>
                <button
                  onClick={handleBackToCart}
                  className="w-full py-3.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 cursor-pointer"
                >
                  Back to Cart
                </button>
              </div>
            )}

            {view === 'review' && (
              <div className="space-y-3">
                <button
                  onClick={() => initializePayment(onSuccess, onClose)}
                  className="w-full py-3.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 cursor-pointer flex items-center justify-center gap-2"
                >
                  Pay ₦{subtotal.toLocaleString()}
                </button>
                <button
                  onClick={handleBackToBilling}
                  className="w-full py-3.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 cursor-pointer"
                >
                  Edit Billing Info
                </button>
              </div>
            )}

            {view === 'cart' && Object.keys(cart).length > 0 && (
              <button onClick={clearCart} className="w-full py-3 border border-gray-300 rounded-lg font-medium text-gray-700 cursor-pointer">
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {open && <div className="fixed inset-0 bg-black/20 z-40" onClick={closeCart} />}
    </>
  );
}
