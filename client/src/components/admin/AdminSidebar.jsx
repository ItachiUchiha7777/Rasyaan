import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Users,
  Grid,
  Settings,
  LogOut,
  Mountain
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Products', path: '/admin/products', icon: <Package className="w-5 h-5" /> },
    { label: 'Orders', path: '/admin/orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { label: 'Customers', path: '/admin/customers', icon: <Users className="w-5 h-5" /> },
    { label: 'Categories', path: '/admin/categories', icon: <Grid className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-charcoal/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-forest text-cream flex flex-col justify-between transition-transform duration-300 transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } border-r border-pine`}
      >
        <div>
          {/* Admin Header / Logo */}
          <div className="p-6 border-b border-pine flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-saffron text-forest flex items-center justify-center font-bold">
              <Mountain className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-wider text-cream">RASYAAN</span>
              <span className="block text-[10px] text-saffron uppercase font-bold tracking-widest">
                Admin Control
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-saffron text-forest font-bold shadow-md'
                    : 'text-cream/80 hover:bg-pine hover:text-cream'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Bottom Section */}
        <div className="p-4 border-t border-pine">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-950/50 hover:text-rose-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Admin Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
