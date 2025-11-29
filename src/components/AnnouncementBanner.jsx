// components/AnimatedBanner.jsx
export default function AnimatedBanner() {
  return (
    <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap">
        <span className="mx-8">🚀 FREE SHIPPING ON ALL ORDERS OVER ₦50,000 • </span>
        <span className="mx-8">🎉 USE CODE: PREMIUM20 FOR 20% OFF • </span>
        <span className="mx-8">🔥 NEW COLLECTION JUST DROPPED • </span>
        <span className="mx-8">🚀 FREE SHIPPING ON ALL ORDERS OVER ₦50,000 • </span>
        <span className="mx-8">🎉 USE CODE: PREMIUM20 FOR 20% OFF • </span>
        <span className="mx-8">🔥 NEW COLLECTION JUST DROPPED</span>
      </div>
    </div>
  );
}