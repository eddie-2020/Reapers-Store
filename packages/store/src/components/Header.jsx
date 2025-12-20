// components/Header.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import logo from '../assets/logo2.png';

export default function Header({ cartCount, onCartOpen, currentView, onNavigate, products = [], searchValue, onSearchChange }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Catalogs', path: '/catalog' },
    // Add other links if they existed, e.g., About, Contact. Assuming basic store links.
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Use controlled prop if available, otherwise internal state
  const queryValue = searchValue !== undefined ? searchValue : internalSearchQuery;

  const handleSearchChange = (e) => {
    // ... (existing helper if needed, or inline)
  }

  // Close search if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(event.target))
      ) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Removed dependency on searchValue


  return (
    <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 relative">

          {/* Left: Logo + Hamburger */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-md transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Logo */}
            <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }} className="flex-shrink-0 cursor-pointer">
              <img src={logo} alt="REAPERS" className="h-10 lg:h-12 w-auto object-contain" />
            </button>
          </div>

          {/* Desktop Nav - Centered */}
          <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {navigationItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-sm font-medium transition-colors duration-200 cursor-pointer relative py-2 ${isActive(item.path) ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-full" />
                )}
              </button>
            ))}
          </nav>
          {/* 
            Wait, I should fix the NAV mapping logic properly. The button is the container.
            If I want the underline to have rounded caps, `border-b` is square. 
            I will use a `span` with `border-b`? No, standard CSS border-b is always square ends unless we use SVG or separate div.
            Tomi probably just means "rounded-full" style for the active pill if it were a pill, but it's an underline.
            Maybe they mean the button background? No "separator" implies the line.
            I will assume standard border is fine but maybe I can use `stroke-linecap` if it was SVG.
            Let's just update the search toggle logic primarily and add `rounded-full` to the button to see if it helps soften it, or just ignore subtle border-radius on lines for now as it's CSS-limited without SVG/divs.
            Actually, I will rewrite the nav item to use a generic 'relative' container and an absolute 'bottom-0' div for the line, which supports rounded-full.
          */}

          {/* UPDATED NAV LOGIC BELOW IN REPLACEMENT CONTENT */}

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4 relative">

            {/* Search input */}
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={queryValue}
              onChange={(e) => {
                const query = e.target.value;

                if (onSearchChange) {
                  onSearchChange(query);
                } else {
                  setInternalSearchQuery(query);
                }

                // Always update local search results for the dropdown, regardless of parent control
                if (!products || products.length === 0 || query.trim() === '') {
                  setSearchResults([]);
                } else {
                  const results = products.filter(product =>
                    product.title?.toLowerCase().includes(query.toLowerCase()) ||
                    product.Title?.toLowerCase().includes(query.toLowerCase())
                  );
                  setSearchResults(results);
                }
              }}
              className={`text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 h-9 box-border
                ${searchOpen ? 'w-48 opacity-100 px-3' : 'w-0 opacity-0 px-0 border-0'}
              `}
            />

            {/* Dropdown results */}
            {searchOpen && searchResults.length > 0 && (
              <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                {/* Updated width and positioning */}
                {searchResults.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigate(`/product/${item.id}`);
                      setSearchOpen(false);
                      setInternalSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-b-0 flex items-center gap-3"
                  >
                    {/* Show tiny image if available in search */}
                    {item.images && item.images[0] && (
                      <img src={item.images[0]} alt="" className="w-8 h-8 object-cover rounded" />
                    )}
                    <span className="truncate">{item.title || item.Title}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Search icon */}
            <button
              ref={buttonRef}
              onClick={() => {
                setSearchOpen(prev => !prev);
                if (!searchOpen) setTimeout(() => inputRef.current?.focus(), 100);
              }}
              className={`hidden sm:block p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer ${searchValue !== undefined ? 'text-gray-900 bg-gray-100' : ''}`}
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
                  className={`block w-full text-left px-4 py-3 text-base font-medium transition-colors cursor-pointer relative ${isActive(item.path)
                    ? 'bg-gray-50 text-gray-900' // Removed border-l-4
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <div className="absolute right-0 top-2 bottom-2  w-0.5 bg-gray-900 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
