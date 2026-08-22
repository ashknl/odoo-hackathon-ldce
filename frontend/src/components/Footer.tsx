import React, { useState } from 'react';
import { 
  Send, 
  Check, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Globe
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white border-t border-slate-100 text-slate-500 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 5-Column Grid (Exact layout from reference) */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-10 pb-12">
          
          {/* Column 1: Brand Info & Socials */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <a href="#" className="inline-block">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-display">
                Globe<span className="text-[#0284c7]">Trotter</span>
              </span>
            </a>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              30 Great Peter St, Westminster,<br />
              London SW1P 2BU, United Kingdom
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-[#0284c7] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-[#0284c7] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-[#0284c7] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-[#0284c7] hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: About */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <span className="text-xs font-bold text-slate-900 tracking-wider block">
              About
            </span>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="#" className="hover:text-slate-900 transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">News</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Plans</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <span className="text-xs font-bold text-slate-900 tracking-wider block">
              Company
            </span>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="#" className="hover:text-slate-900 transition-colors">Why GlobeTrotter</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Partner with us</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <span className="text-xs font-bold text-slate-900 tracking-wider block">
              Support
            </span>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="#" className="hover:text-slate-900 transition-colors">Account</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Support center</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Feedback</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Contact us</a></li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div className="col-span-2 md:col-span-2 space-y-3">
            <span className="text-xs font-bold text-slate-900 tracking-wider block">
              Newsletter
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe our newsletter and get exciting offers
            </p>

            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-3.5 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
              />
              <button
                type="submit"
                className="absolute right-1 p-2 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white transition-colors cursor-pointer"
                aria-label="Subscribe"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
            {isSubscribed && (
              <span className="text-[11px] text-emerald-600 font-medium inline-flex items-center gap-1">
                <Check className="w-3 h-3" /> Subscribed successfully!
              </span>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 Tripco. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
