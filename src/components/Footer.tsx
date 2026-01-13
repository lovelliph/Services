import { Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
  const navigate = useNavigate();
  return (
    <footer className="bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <img src="/logo.png" alt="Lovelli" className="h-8 mb-6 brightness-0 invert" />
            <p className="text-gray-400 leading-relaxed">
              Crafting exceptional digital experiences that drive results and inspire audiences.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => scrollToSection('works')} className="text-gray-400 hover:text-white transition-colors">
                  Works
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white transition-colors">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white transition-colors">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('blog')} className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/apply')} className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400">PH +63 916 740 305</p>
                  <p className="text-gray-400">US +1 234 567 890</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <a href="mailto:hello@lovelli.com" className="text-gray-400 hover:text-white transition-colors">
                  hello@lovelli.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-400">Around the world.</p>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/10 border border-white/20 px-4 py-2 text-sm focus:outline-none focus:border-white transition-colors"
              />
              <button className="bg-white text-black px-6 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            MMXXV © lovelli. all rights reserved
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Instagram
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              LinkedIn
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
