
export default function SeasonalBanner() {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            🎁
          </div>
          <div>
            <div className="font-bold text-lg">Holiday Special</div>
            <div className="text-sm opacity-90">Get 25% off on all premium collections</div>
          </div>
        </div>

        <button className="bg-white text-emerald-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
          Claim Offer
        </button>
      </div>
    </div>
  );
}