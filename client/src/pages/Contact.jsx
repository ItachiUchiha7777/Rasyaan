import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { MountainDivider } from '../components/common/MountainDivider';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-terracotta">We'd Love to Hear From You</span>
        <h1 className="font-serif text-4xl font-bold text-forest">Connect with Rasyaan</h1>
        <MountainDivider />
        <p className="text-xs sm:text-sm text-charcoal/70">
          Have questions about our Himalayan harvests, bulk orders, or shipping? Reach out to us.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Contact info cards */}
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-3xl border border-cream-dark shadow-sm flex items-start space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-forest/10 text-forest flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-forest text-sm">Email Us</h4>
              <a href="mailto:hello@rasyaan.in" className="text-xs text-terracotta font-bold hover:underline">
                hello@rasyaan.in
              </a>
              <p className="text-[11px] text-charcoal/50 mt-0.5">We respond within 24 hours.</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-cream-dark shadow-sm flex items-start space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-forest text-sm">Call Support</h4>
              <p className="text-xs font-bold text-forest">+91 98765 43210</p>
              <p className="text-[11px] text-charcoal/50 mt-0.5">Mon – Sat: 9:00 AM – 6:00 PM IST</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-cream-dark shadow-sm flex items-start space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-pine/10 text-pine flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-forest text-sm">Headquarters</h4>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Rasyaan Himalayan Produce Ltd.<br />
                Rajpur Road, Dehradun & Chamoli Valley,<br />
                Uttarakhand - 248001
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-cream-dark shadow-sm space-y-6">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-forest mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-forest">Thank You!</h3>
              <p className="text-xs text-charcoal/70 max-w-sm mx-auto">
                Your message has been delivered to the Rasyaan team. We will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Rahul Gusain"
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@example.com"
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Inquiry about Himalayan Wild Honey bulk order"
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Message *</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you today?"
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
                  required
                />
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg">
                <span>Send Message</span>
                <Send className="w-4 h-4 ml-2 inline" />
              </Button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
