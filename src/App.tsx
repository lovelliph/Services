import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Hero from './components/Hero';
import Services from './components/Services';
import Mission from './components/Mission';
import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import MobileMenu from './components/MobileMenu';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-bold tracking-tight">
              lovelli<span className="text-gray-400">.</span>
            </div>

            <div className="hidden lg:flex items-center gap-12">
              <button onClick={() => scrollToSection('works')} className="text-sm font-medium hover:text-gray-600 transition-colors">
                WORKS
              </button>
              <button onClick={() => scrollToSection('services')} className="text-sm font-medium hover:text-gray-600 transition-colors">
                SERVICES
              </button>
              <button onClick={() => scrollToSection('about')} className="text-sm font-medium hover:text-gray-600 transition-colors">
                ABOUT
              </button>
              <button onClick={() => scrollToSection('blog')} className="text-sm font-medium hover:text-gray-600 transition-colors">
                BLOG
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-black text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                GET IN TOUCH
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        scrollToSection={scrollToSection}
      />

      <Hero />
      <Services />
      <Mission />
      <Testimonials />
      <Blog />
      <Pricing />
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
}

export default App;
