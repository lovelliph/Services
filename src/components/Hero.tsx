import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          transform: `translateY(${scrollY * 0.5}px)`,
          filter: 'brightness(0.4)'
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 leading-none"
          style={{
            opacity: 1 - scrollY / 600,
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        >
          Filipino
        </h1>
        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-12 leading-none"
          style={{
            opacity: 1 - scrollY / 600,
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        >
          Excellence
        </h1>

        <div
          className="flex flex-col items-center gap-4"
          style={{
            opacity: 1 - scrollY / 400
          }}
        >
          <p className="text-sm text-gray-300 uppercase tracking-widest">(Scroll Down)</p>
          <ChevronDown className="h-6 w-6 text-white animate-bounce" />
        </div>
      </div>
    </section>
  );
}
