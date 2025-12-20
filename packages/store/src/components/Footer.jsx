// components/Footer.jsx
import { FaTiktok, FaInstagram, FaTwitter, FaCreditCard, FaUniversity, FaMobileAlt, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";


export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-serif font-bold mb-4">REAPERS</div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium fashion curated for the modern individual. Discover exceptional quality,
              timeless style, and pieces that tell your unique story.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <FaTiktok size={20} />, link: "https://tiktok.com" },
                { icon: <FaInstagram size={20} />, link: "https://instagram.com" },
                { icon: <FaTwitter size={20} />, link: "https://twitter.com" },
                { icon: <MdEmail size={22} />, link: "mailto:example@gmail.com" },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Shop</h3>
            <ul className="space-y-3">
              {['New Arrivals', 'Bestsellers', 'Collections', 'Sale', 'Lookbook'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Support</h3>
            <ul className="space-y-3">
              {['Contact Us', 'Shipping Info', 'Returns', 'Size Guide', 'Care Instructions'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors duration-200 text-sm"
              />
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02] text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-12"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-gray-400 text-sm">
            © 2025 REAPERS NATION. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex space-x-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="flex space-x-3">
            {[
              { icon: <FaCreditCard size={18} />, link: "https://credit-card.com", label: "Credit Card" },
              { icon: <FaUniversity size={18} />, link: "https://university.com", label: "Bank Transfer" },
              { icon: <FaMobileAlt size={18} />, link: "https://mobile.com", label: "Mobile Payment" },
              { icon: <FaLock size={18} />, link: "https://lock.com", label: "Secure Checkout" }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-gray-400 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
              >
                {item.icon}

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block w-max px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg border border-gray-700 whitespace-nowrap z-10 font-sans">
                  {item.label}
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}