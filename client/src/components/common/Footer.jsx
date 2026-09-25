import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { AipanPattern } from './AipanPattern';

export const Footer = () => {
  return (
    <footer className="bg-forest text-cream pt-16 pb-8 border-t border-pine relative overflow-hidden">
      {/* Background Decorative Mountain Shapes */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 320" fill="none">
          <path d="M0 192L60 170.7C120 149 240 107 360 112C480 117 600 171 720 186.7C840 203 960 181 1080 154.7C1200 128 1320 96 1380 80L1440 64V320H0Z" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-pine-light/30">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-saffron text-forest flex items-center justify-center font-bold">
                <svg className="w-6 h-6 fill-current text-forest" viewBox="0 0 24 24">
                  <path d="M14 6l-3.8 5.7 1.8 2.7H5l7-10 7 10h-2.5L14 6z" />
                </svg>
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-cream">RASYAAN</span>
            </div>
            <p className="text-saffron font-medium text-sm tracking-wide">Pahad ka swaad, ghar tak.</p>
            <p className="text-cream/70 text-sm leading-relaxed max-w-sm">
              From the high-altitude valleys of Uttarakhand to your home. Rasyaan brings pure Himalayan pulses, raw forest honey, sun-dried spices, and handcrafted mountain traditions.
            </p>
            <div className="pt-2 flex items-center space-x-4 text-cream/70 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-saffron" />
                <span>Dehradun & Chamoli, Uttarakhand</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream font-serif text-lg font-semibold mb-4 border-b border-saffron/40 pb-1 inline-block">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-cream/70">
              <li>
                <Link to="/shop" className="hover:text-saffron transition-colors">Shop All Products</Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-saffron transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-saffron transition-colors">Our Pahadi Story</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-saffron transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div>
            <h4 className="text-cream font-serif text-lg font-semibold mb-4 border-b border-saffron/40 pb-1 inline-block">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-sm text-cream/70">
              <li>
                <span className="hover:text-saffron cursor-pointer transition-colors">Shipping & Delivery</span>
              </li>
              <li>
                <span className="hover:text-saffron cursor-pointer transition-colors">Returns & Refunds</span>
              </li>
              <li>
                <span className="hover:text-saffron cursor-pointer transition-colors">Authenticity Guarantee</span>
              </li>
              <li>
                <span className="hover:text-saffron cursor-pointer transition-colors">FAQs</span>
              </li>
            </ul>
          </div>

          {/* Socials & Newsletter */}
          <div>
            <h4 className="text-cream font-serif text-lg font-semibold mb-4 border-b border-saffron/40 pb-1 inline-block">
              Follow & Connect
            </h4>
            <p className="text-xs text-cream/70 mb-4">Stay tuned for seasonal harvests & mountain recipes.</p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 rounded-full bg-pine flex items-center justify-center hover:bg-saffron hover:text-forest transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-pine flex items-center justify-center hover:bg-saffron hover:text-forest transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-pine flex items-center justify-center hover:bg-saffron hover:text-forest transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 text-center flex flex-col md:flex-row items-center justify-between text-xs text-cream/60">
          <p>© {new Date().getFullYear()} Rasyaan E-Commerce. All rights reserved.</p>
          <div className="flex items-center space-x-1 my-2 md:my-0 text-saffron">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-current text-terracotta" />
            <span>for the Pahad & Uttarakhand</span>
          </div>
          <p className="text-cream/50">Designed with Himalayan Pride</p>
        </div>
      </div>
    </footer>
  );
};
