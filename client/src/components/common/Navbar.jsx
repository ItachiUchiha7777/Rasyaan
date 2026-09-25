import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User as UserIcon, Menu, X, ChevronDown, LogOut, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar = ({ onOpenSearch }) => {
  const { user, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-cream-dark/60 transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-forest text-cream text-xs py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-center space-x-2">
        <span className="inline-block w-2 h-2 rounded-full bg-saffron animate-pulse" />
        <span>Free Shipping on Himalayan Produce Orders Above ₹999 | Authentic Uttarakhand Quality</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-cream shadow-md group-hover:bg-pine transition-colors">
              {/* Subtle mountain icon */}
              <svg className="w-6 h-6 fill-current text-saffron" viewBox="0 0 24 24">
                <path d="M14 6l-3.8 5.7 1.8 2.7H5l7-10 7 10h-2.5L14 6z" />
              </svg>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider text-forest group-hover:text-pine transition-colors">
                RASYAAN
              </span>
              <span className="block text-[10px] tracking-widest text-terracotta uppercase font-semibold -mt-1">
                Pahad ka swaad, ghar tak
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium tracking-wide transition-colors ${
                isActive('/') ? 'text-terracotta font-semibold' : 'text-charcoal/80 hover:text-forest'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`text-sm font-medium tracking-wide transition-colors ${
                isActive('/shop') ? 'text-terracotta font-semibold' : 'text-charcoal/80 hover:text-forest'
              }`}
            >
              Shop
            </Link>
            <Link
              to="/categories"
              className={`text-sm font-medium tracking-wide transition-colors ${
                isActive('/categories') ? 'text-terracotta font-semibold' : 'text-charcoal/80 hover:text-forest'
              }`}
            >
              Categories
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium tracking-wide transition-colors ${
                isActive('/about') ? 'text-terracotta font-semibold' : 'text-charcoal/80 hover:text-forest'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium tracking-wide transition-colors ${
                isActive('/contact') ? 'text-terracotta font-semibold' : 'text-charcoal/80 hover:text-forest'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-5">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-charcoal/80 hover:text-forest hover:bg-cream-muted rounded-full transition-colors"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account / User Menu */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 text-sm font-medium text-charcoal/90 hover:text-forest rounded-full hover:bg-cream-muted transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-forest text-cream flex items-center justify-center text-xs font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-4 h-4 text-charcoal/60" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-cream border border-cream-dark shadow-xl rounded-xl py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-cream-dark">
                        <p className="text-xs text-charcoal/60 font-medium">Logged in as</p>
                        <p className="text-sm font-semibold text-forest truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-charcoal hover:bg-cream-muted transition-colors"
                      >
                        <Package className="w-4 h-4 mr-2 text-forest" />
                        My Orders & Account
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 p-2 text-charcoal/80 hover:text-forest hover:bg-cream-muted rounded-full transition-colors"
                  title="Account"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}
            </div>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-forest hover:bg-cream-muted rounded-full transition-colors"
              title="View Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-cream font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-charcoal/80 hover:text-forest rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-b border-cream-dark px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-charcoal hover:text-terracotta border-b border-cream-dark/40"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-charcoal hover:text-terracotta border-b border-cream-dark/40"
          >
            Shop
          </Link>
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-charcoal hover:text-terracotta border-b border-cream-dark/40"
          >
            Categories
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-charcoal hover:text-terracotta border-b border-cream-dark/40"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-charcoal hover:text-terracotta border-b border-cream-dark/40"
          >
            Contact
          </Link>
          {user ? (
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-forest hover:text-terracotta"
            >
              My Account & Orders
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-forest hover:text-terracotta"
            >
              Login / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
