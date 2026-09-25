import React from 'react';

export const AddressForm = ({ formData, onChange, errors = {} }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={onChange}
            placeholder="Rahul Gusain"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
            required
          />
          {errors.name && <p className="text-[10px] text-rose-600 mt-0.5">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={onChange}
            placeholder="rahul@example.com"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
            required
          />
          {errors.email && <p className="text-[10px] text-rose-600 mt-0.5">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-charcoal/80 mb-1">Phone Number *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone || ''}
          onChange={onChange}
          placeholder="+91 9876543210"
          className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
          required
        />
        {errors.phone && <p className="text-[10px] text-rose-600 mt-0.5">{errors.phone}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">House / Flat / Village *</label>
          <input
            type="text"
            name="house"
            value={formData.house || ''}
            onChange={onChange}
            placeholder="House No 45 / Village Munsiyari"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">Street / Area / Landmark *</label>
          <input
            type="text"
            name="street"
            value={formData.street || ''}
            onChange={onChange}
            placeholder="Rajpur Road / Near Deodar Forest"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">City / Town *</label>
          <input
            type="text"
            name="city"
            value={formData.city || ''}
            onChange={onChange}
            placeholder="Dehradun"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">District *</label>
          <input
            type="text"
            name="district"
            value={formData.district || ''}
            onChange={onChange}
            placeholder="Dehradun"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal/80 mb-1">Pincode *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode || ''}
            onChange={onChange}
            placeholder="248001"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-charcoal/80 mb-1">State *</label>
        <input
          type="text"
          name="state"
          value={formData.state || 'Uttarakhand'}
          onChange={onChange}
          className="w-full text-xs py-2.5 px-3 rounded-xl border border-cream-dark bg-cream-muted focus:outline-none text-charcoal font-semibold"
          required
        />
      </div>
    </div>
  );
};
