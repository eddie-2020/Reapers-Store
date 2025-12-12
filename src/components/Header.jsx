// components/Header.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

export default function Header({ cartCount, onCartOpen, currentView, onNavigate, products = [] }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/catalog', label: 'Catalog' }
  ];

  // Close search if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Left: Logo + Hamburger */}
          <div className="flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 mr-3"
            >
              <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>

            <div 
              onClick={() => onNavigate('home')}
              className="text-xl sm:text-2xl font-serif font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent cursor-pointer"
            >
              REAPERS
            </div>
          </div>

          {/* Navigation buttons - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map(item => (
              <button 
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-sm font-medium transition-colors duration-200 py-2 relative group ${
                  isActive(item.path) ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-200 group-hover:w-full ${
                  isActive(item.path) ? 'w-full' : ''
                }`}></span>
              </button>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4 relative">

            {/* Search input */}
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                const query = e.target.value;
                setSearchQuery(query);

                if (!products || products.length === 0 || query.trim() === '') {
                  setSearchResults([]);
                  return;
                }

                const results = products.filter(product =>
                  product.Title.toLowerCase().includes(query.toLowerCase())
                );
                setSearchResults(results);
              }}
              className={`text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300
                ${searchOpen ? 'w-48 opacity-100 pl-10 p-2' : 'w-0 opacity-0 p-0 border-0'}
              `}
            />

            {/* Dropdown results */}
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                {searchResults.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigate(`/product/${item.id}`);
                      setSearchOpen(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {item.Title}
                  </div>
                ))}
              </div>
            )}

            {/* Search icon */}
            <button
              onClick={() => {
                setSearchOpen(prev => !prev);
                if (!searchOpen) inputRef.current.focus();
              }}
              className="hidden sm:block p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer"
            >
              <FiSearch size={20} />
            </button>

            {/* User icon */}
            <button className="hidden sm:block p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer">
              <FaUser size={20} />
            </button>

            {/* Cart icon */}
            <button 
              onClick={onCartOpen}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer"
            >
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="py-2">
              {navigationItems.map(item => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-gray-50 text-gray-900 border-r-2 border-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
