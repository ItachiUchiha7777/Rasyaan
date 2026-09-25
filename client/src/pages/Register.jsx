import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, phone } = formData;

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register({ name, email, password, phone });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl border border-cream-dark shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-bold text-forest">Create Account</h2>
          <p className="text-xs text-charcoal/60">Join the Rasyaan Pahadi community today</p>
        </div>

        {error && <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rahul Gusain"
                className="w-full text-xs py-3 pl-10 pr-4 rounded-xl border border-cream-dark bg-cream/30 focus:outline-none focus:border-forest text-charcoal"
                required
              />
              <UserIcon className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                className="w-full text-xs py-3 pl-10 pr-4 rounded-xl border border-cream-dark bg-cream/30 focus:outline-none focus:border-forest text-charcoal"
                required
              />
              <Mail className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full text-xs py-3 pl-10 pr-4 rounded-xl border border-cream-dark bg-cream/30 focus:outline-none focus:border-forest text-charcoal"
              />
              <Phone className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Password *</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-xs py-3 pl-10 pr-4 rounded-xl border border-cream-dark bg-cream/30 focus:outline-none focus:border-forest text-charcoal"
                required
              />
              <Lock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Confirm Password *</label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-xs py-3 pl-10 pr-4 rounded-xl border border-cream-dark bg-cream/30 focus:outline-none focus:border-forest text-charcoal"
                required
              />
              <Lock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
            <span>Register & Continue</span>
            <ArrowRight className="w-4 h-4 ml-2 inline" />
          </Button>
        </form>

        <p className="text-center text-xs text-charcoal/70">
          Already have an account?{' '}
          <Link to="/login" className="text-terracotta font-bold hover:underline">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
};
