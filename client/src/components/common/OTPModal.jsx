import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, RefreshCw } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const OTPModal = ({ isOpen, onClose, email, onVerify, onResend, loading }) => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(600);
    setError('');
    setOtp('');

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter the full 6-digit code');
      return;
    }
    setError('');
    onVerify(otp);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Order Verification">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 bg-forest/10 text-forest rounded-full mx-auto flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-forest" />
        </div>

        <p className="text-sm text-charcoal/80">
          We have sent a 6-digit verification code to <span className="font-semibold text-forest">{email}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="482913"
              className="w-full text-center text-2xl font-bold tracking-widest py-3 border-2 border-forest/30 rounded-xl bg-white focus:outline-none focus:border-forest"
              autoFocus
            />
            {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
          </div>

          <div className="flex items-center justify-between text-xs text-charcoal/60">
            <span>
              Expires in: <strong className="text-forest">{formatTime(timeLeft)}</strong>
            </span>
            <button
              type="button"
              onClick={onResend}
              disabled={timeLeft > 540} // Resend allowed after 60 secs
              className="text-terracotta hover:underline font-semibold flex items-center space-x-1 disabled:opacity-40"
            >
              <RefreshCw className="w-3 h-3 mr-1 inline" />
              Resend Code
            </button>
          </div>

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Verify Code & Place Order
          </Button>
        </form>

        <p className="text-[11px] text-charcoal/50">
          Check your spam/junk folder if you do not see the email in your main inbox.
        </p>
      </div>
    </Modal>
  );
};
