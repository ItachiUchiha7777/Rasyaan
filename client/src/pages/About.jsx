import React from 'react';
import { MountainDivider } from '../components/common/MountainDivider';
import { AipanPattern } from '../components/common/AipanPattern';

export const About = () => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Banner */}
      <section className="relative h-[60vh] flex items-center justify-center bg-forest text-cream text-center px-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=80"
          alt="Garhwal Himalayas"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-saffron">The Rasyaan Journey</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight">
            Born in the mountains. <br />
            <span className="italic font-normal text-saffron">Made for everywhere.</span>
          </h1>
          <p className="text-sm sm:text-lg text-cream/80 max-w-2xl mx-auto font-light leading-relaxed">
            Bridging the high valleys of Garhwal and Kumaon to homes across India with unadulterated produce and Himalayan pride.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-serif text-3xl font-bold text-forest">The Heart of Uttarakhand</h2>
          <MountainDivider />
          <p className="text-charcoal/80 text-sm leading-relaxed">
            Rasyaan was founded with a single mission: to preserve and share the rich agricultural heritage of Uttarakhand with the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-forest">Garhwali Traditions & Terrace Farming</h3>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              In the steep terraced fields of the Himalayas, farming is an art handed down across centuries. Free from synthetic chemicals, crops like Mandua, Jhangora, and Pahadi Rajma absorb mineral-rich soil and glacial meltwater.
            </p>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              Every crop is nurtured by mountain sunshine, traditional hand-threshing methods, and deep respect for nature.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-cream-dark h-80">
            <img
              src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
              alt="Terraced farming in Uttarakhand"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center md:flex-row-reverse">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-cream-dark h-80 order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80"
              alt="Wild forest honey harvesting"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4 order-1 md:order-2">
            <h3 className="font-serif text-2xl font-bold text-forest">Empowering Mountain Communities</h3>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              By partnering directly with self-help artisan groups, rural women cooperatives, and smallholder farmers, Rasyaan ensures fair wages and preserves local mountain economies.
            </p>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              When you choose Rasyaan, you directly support the livelihood of families living in remote high-altitude Himalayan villages.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
