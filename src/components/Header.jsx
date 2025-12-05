// components/Header.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ cartCount, onCartOpen, currentView, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/catalog', label: 'Catalog' }
  ];

  return (
    <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="flex justify-between items-center py-4">
          {/* Left: Logo + Hamburger (mobile) */}
          <div className="flex items-center">
            {/* Hamburger Menu - Mobile only */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 mr-3"
            >
              <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>

            {/* Logo */}
            <div 
              onClick={() => onNavigate('home')}
              className="text-xl sm:text-2xl font-serif font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent cursor-pointer"
            >
              REAPERS
            </div>
          </div>

        {/* Navigation buttons - Desktop only */}
          <nav className="hidden lg:flex items-center space-x-8">
          {navigationItems.map((item) => (
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
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search icon - Hidden on mobile */}
            <button className="hidden sm:block p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200">
              <span className="text-lg">🔍</span>
            </button>

            {/* User icon - Hidden on mobile */}
            <button className="hidden sm:block p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200">
              <span className="text-lg">👤</span>
            </button>

            {/* Cart icon - Always visible */}
            <button 
              onClick={onCartOpen}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <span className="text-lg">🛒</span>
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
              {navigationItems.map((item) => (
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