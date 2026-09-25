import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, HeartHandshake, Leaf, Mountain, Sparkles, Send } from 'lucide-react';
import API from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { MountainDivider } from '../components/common/MountainDivider';
import { AipanPattern } from '../components/common/AipanPattern';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get('/products/featured'),
          API.get('/categories')
        ]);
        setFeaturedProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-16 pb-16 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-forest">
        {/* Background Image with mist gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80"
            alt="Uttarakhand Himalayan Pine Forest & Valley"
            className="w-full h-full object-cover opacity-35 scale-105 animate-mist"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/60 to-transparent" />
        </div>

        {/* Floating subtle mountain graphic accent */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6 pt-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-saffron/20 border border-saffron/40 text-saffron text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pure Himalayan Heritage & Organic Market</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-cream tracking-tight leading-tight">
            Discover the Soul <br />
            <span className="italic font-normal text-saffron">of the Pahad.</span>
          </h1>

          <p className="text-base sm:text-xl text-cream/80 max-w-2xl mx-auto font-light leading-relaxed">
            Authentic Garhwali flavours, handmade treasures, and mountain traditions — delivered to your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-saffron text-forest font-bold hover:bg-saffron-light transition-all shadow-xl hover:shadow-saffron/20 flex items-center justify-center space-x-2 text-base"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-cream/40 text-cream font-semibold hover:bg-cream/10 transition-all text-base"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta">Mountain Harvest</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">Explore Categories</h2>
          <MountainDivider />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden h-48 border border-cream-dark shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent flex items-end p-4">
                <span className="font-serif text-sm font-bold text-cream group-hover:text-saffron transition-colors">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta">Handpicked Treasures</span>
            <h2 className="font-serif text-3xl font-bold text-forest">Featured Pahadi Products</h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-bold text-forest hover:text-terracotta flex items-center space-x-1 group"
          >
            <span>View All Store Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* TASTE OF THE PAHAD STORYTELLING */}
      <section className="bg-cream-muted py-16 border-y border-cream-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta">Tradition & Heritage</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
              “Har swaad mein ek kahani.”
            </h2>
            <p className="text-charcoal/80 text-sm sm:text-base leading-relaxed">
              Traditional Pahadi food is deeply tied to the mountains, changing seasons, and generations of terrace-farming wisdom. In the high valleys of Uttarakhand, crops are fed by glacial meltwater and sun-cured naturally in crisp mountain air.
            </p>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              From stone-ground Mandua flour to wild flower honey harvested deep inside Deodar forests, Rasyaan brings you unadulterated produce rooted in ancient Garhwali recipes and sustainable mountain living.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-forest text-cream font-semibold hover:bg-pine transition-all shadow"
              >
                <span>Read Our Mountain Journey</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-96">
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80"
              alt="Pahadi Spices & Tradition"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* UTTARAKHAND QUOTE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-forest text-cream p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between h-64 border border-pine">
            <div className="absolute -right-4 -bottom-4 text-pine/30 opacity-40">
              <Mountain className="w-40 h-40" />
            </div>
            <p className="font-serif text-xl font-bold italic leading-relaxed z-10 text-saffron">
              “Pahad sirf ek jagah nahi, ek ehsaas hai.”
            </p>
            <p className="text-xs text-cream/70 font-medium tracking-wider uppercase z-10">
              — The Essence of Mountain Living
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-cream-dark shadow-sm flex flex-col justify-between h-64">
            <p className="font-serif text-xl font-bold text-forest leading-relaxed italic">
              “Jahan hawa mein devdar ki khushboo ho, wahi toh pahad hai.”
            </p>
            <p className="text-xs text-terracotta font-medium tracking-wider uppercase">
              — Uttarakhand Deodar Valleys
            </p>
          </div>

          <div className="bg-terracotta text-cream p-8 rounded-3xl flex flex-col justify-between h-64 shadow-md">
            <p className="font-serif text-xl font-bold leading-relaxed italic">
              “Pahad ka swaad, pahad ki mitti se.”
            </p>
            <p className="text-xs text-cream/80 font-medium tracking-wider uppercase">
              — Soil of Uttarakhand
            </p>
          </div>
        </div>
      </section>

      {/* WHY RASYAAN? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta">Our Commitment</span>
          <h2 className="font-serif text-3xl font-bold text-forest">Why Rasyaan?</h2>
          <MountainDivider />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-cream-dark/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest mx-auto flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-forest">100% Authentic</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Products directly sourced from regional mountain farmers and traditional Garhwali artisans.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-cream-dark/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta mx-auto flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-forest">Local Producers</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Empowering local mountain farming families and self-help artisan guilds across Garhwal & Kumaon.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-cream-dark/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-pine/10 text-pine mx-auto flex items-center justify-center font-bold">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-forest">Fresh & Organic</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Non-GMO, naturally cultivated produce free from synthetic chemicals and artificial preservatives.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-cream-dark/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-saffron/20 text-forest mx-auto flex items-center justify-center font-bold">
              <Mountain className="w-6 h-6 text-saffron" />
            </div>
            <h3 className="font-serif text-lg font-bold text-forest">From the Pahad</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Bringing high-altitude Himalayan flavours and traditions straight to your urban kitchen.
            </p>
          </div>
        </div>
      </section>

      {/* MOUNTAIN STORY BANNER */}
      <section className="relative h-80 rounded-3xl max-w-7xl mx-auto overflow-hidden text-center flex items-center justify-center text-cream px-4">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
          alt="Himalayan Mountains"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-forest/70" />
        <div className="relative z-10 space-y-4 max-w-xl">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream">
            From the mountains, with love.
          </h2>
          <p className="text-sm text-cream/90 leading-relaxed">
            Every harvest carries the warmth of mountain sun, pure glacial streams, and stories of traditional hill life.
          </p>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-3xl mx-auto text-center px-4 space-y-4">
        <h3 className="font-serif text-2xl font-bold text-forest">Get a little Pahad in your inbox.</h3>
        <p className="text-xs text-charcoal/70">
          Subscribe to receive seasonal harvest updates, authentic recipes, and mountain stories.
        </p>

        {subscribed ? (
          <div className="p-4 rounded-xl bg-forest text-cream font-semibold text-sm">
            Thank you for subscribing! Welcome to the Rasyaan Pahadi Family.
          </div>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full text-xs py-3 px-4 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-forest text-charcoal"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-pine transition-all flex items-center justify-center space-x-1 whitespace-nowrap"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5 ml-1" />
            </button>
          </form>
        )}
      </section>

    </div>
  );
};
