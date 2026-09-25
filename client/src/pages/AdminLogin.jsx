import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both admin email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role !== 'admin') {
        setError('Access denied: You do not have administrator privileges.');
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Mountain Glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E08A3C_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="bg-cream w-full max-w-md p-8 rounded-3xl border border-pine shadow-2xl space-y-6 relative z-10 animate-fadeIn">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest text-saffron flex items-center justify-center mx-auto shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-forest">Admin Login</h1>
          <p className="text-xs text-charcoal/60">Secure portal for marketplace administrators</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-100 text-rose-800 rounded-xl border border-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@domain.com"
                autoComplete="username"
                className="w-full text-xs py-3 pl-10 pr-4 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
                required
              />
              <Mail className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Admin Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full text-xs py-3 pl-10 pr-4 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
                required
              />
              <Lock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-2 inline" />
          </Button>
        </form>

      </div>
    </div>
  );
};
