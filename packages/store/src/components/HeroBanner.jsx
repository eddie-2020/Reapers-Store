

import { FaArrowRight } from "react-icons/fa";

export default function HeroBanner({ onShopClick }) {
  return (
    <div className="relative w-full overflow-hidden min-h-[400px]">
      <picture>
        <source media="(min-width: 768px)" srcSet="/hero.jpeg" />
        <img
          src="/hero2.jpeg"
          alt="REAPERS Premium Fashion"
          className="w-full h-auto md:h-[500px] md:object-cover md:object-top"
        />
      </picture>

      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-5xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-['Cinzel']">
              Welcome to <br />
              REAPERS
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Discover premium fashion curated with exceptional taste and attention to detail.
            </p>
            <button
              onClick={onShopClick}
              className="group bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              Shop Collection
              <FaArrowRight className="w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}