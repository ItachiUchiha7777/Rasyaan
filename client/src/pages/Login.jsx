import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Toast } from '../components/common/Toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(redirect ? `/${redirect}` : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate(redirect ? `/${redirect}` : '/');
    } catch (err) {
      console.error(err);
      setError('Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl border border-cream-dark shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-bold text-forest">Welcome Back</h2>
          <p className="text-xs text-charcoal/60">Log in to your Rasyaan Pahadi marketplace account</p>
        </div>

        {error && <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs py-3 pl-10 pr-4 rounded-xl border border-cream-dark bg-cream/30 focus:outline-none focus:border-forest text-charcoal"
                required
              />
              <Mail className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs py-3 pl-10 pr-4 rounded-xl border border-cream-dark bg-cream/30 focus:outline-none focus:border-forest text-charcoal"
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

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cream-dark" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-charcoal/50 font-bold">Or</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full py-3 px-4 rounded-xl border border-cream-dark bg-white hover:bg-cream-muted text-charcoal text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleLoading ? 'Signing in with Google...' : 'Continue with Google'}</span>
        </button>

        <p className="text-center text-xs text-charcoal/70">
          Don't have an account?{' '}
          <Link to="/register" className="text-terracotta font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};
