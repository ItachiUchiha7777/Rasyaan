import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminNavbar = ({ setMobileOpen, title = 'Dashboard Overview' }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-cream-dark px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-charcoal/70 hover:bg-cream-muted rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-serif text-2xl font-bold text-forest">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-cream-dark">
          <div className="w-9 h-9 rounded-full bg-forest text-cream flex items-center justify-center font-bold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-forest">{user?.name || 'Administrator'}</span>
            <span className="block text-[10px] text-terracotta font-semibold uppercase">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
