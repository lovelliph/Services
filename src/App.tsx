import { useState, useEffect } from 'react';
import {
  Share2,
  TrendingUp,
  Video,
  Target,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ContactForm from './components/ContactForm';

function App() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [expandedService, setExpandedService] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: Share2,
      title: 'Consulting & Strategy',
      description: 'Shaping the future of your brand through thoughtful digital strategy.',
      image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg'
    },
    {
      icon: Video,
      title: 'Social Media Management',
      description: 'We manage your social media with strategy, consistency, and creativity!',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'
    },
    {
      icon: TrendingUp,
      title: 'Creative Collaborations',
      description: 'Influencer management focused on strategic collaborations that amplify your brand.',
      image: 'https://images.pexels.com/photos/3182783/pexels-photo-3182783.jpeg'
    },
    {
      icon: Video,
      title: 'Creative Production',
      description: 'High-quality reels, TikTok videos, and product shots that capture attention.',
      image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg'
    },
    {
      icon: Target,
      title: 'Digital Talent Acquisition',
      description: 'Finding the right talent to drive results and take your business to the next level.',
      image: 'https://images.pexels.com/photos/3182769/pexels-photo-3182769.jpeg'
    }
  ];

  const testimonials = [
    {
      text: 'Incredible design work that not only elevated our brand but also enhanced user experience beyond our expectations.',
      author: 'Sarah Chen',
      company: 'Tech Startup'
    },
    {
      text: 'Professional, reliable, and results-driven. The team made sure we were always in the loop and delivered top-notch results.',
      author: 'Marcus Johnson',
      company: 'E-commerce Brand'
    },
    {
      text: "The team's creativity and innovative approach transformed our product into something truly extraordinary.",
      author: 'Emily Rodriguez',
      company: 'Fashion Brand'
    },
    {
      text: 'An amazing team that listens carefully, adapts to changes swiftly, and consistently delivers high-quality work.',
      author: 'David Kim',
      company: 'Digital Agency'
    }
  ];

  const pricing = [
    {
      name: 'Basic Social Media Package',
      price: 250,
      description: 'Best for: Small businesses and startups',
      features: ['Content Planning', 'Monthly Posts', 'Community Engagement', 'Basic Analytics', 'Monthly Reporting']
    },
    {
      name: 'Growth Package',
      price: 350,
      description: 'For businesses ready to expand digital presence',
      features: ['All Basic Features', 'Advanced Analytics', 'Strategy Consultation', 'Multi-Channel Management', 'Priority Support']
    },
    {
      name: 'Trend & Content Package',
      price: null,
      description: 'Custom pricing based on scope and creators',
      features: ['Creator Collaboration Planning', 'Content Production', 'Campaign Management', 'Performance Tracking', 'Full Creative Direction']
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-gray-900" />
              <span className="ml-2 text-xl font-bold text-gray-900">Lovelli</span>
            </div>
            <button
              onClick={() => setShowContactForm(true)}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-black transition-colors font-medium"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1
              className="text-5xl sm:text-7xl font-bold text-gray-900 mb-8 leading-tight transition-all duration-500"
              style={{
                opacity: 1 - scrollY / 600,
                transform: `translateY(${scrollY * 0.3}px)`
              }}
            >
              If your business could speak, what story would it tell?
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              We've crafted 100+ digital experiences blending design, code, and visuals to bring ideas to life.
            </p>
            <button
              onClick={() => setShowContactForm(true)}
              className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-black transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Start Your Project
            </button>
          </div>

          <div className="mt-16 flex justify-center gap-6 flex-wrap">
            {['Design', 'Development', 'Strategy', 'Production', 'Marketing', 'Growth'].map((tag, i) => (
              <div
                key={i}
                className="px-6 py-3 bg-gray-100 rounded-full text-gray-700 font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Showcasing Designs That Solve Real User Problems
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We create thoughtful, user-centered solutions through design, development, and illustration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-gray-100 h-80 relative"
                onClick={() => setExpandedService(expandedService === index ? null : index)}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-200 text-sm">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Client Feedback That Reflects Our Passion and Quality
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 min-h-64 flex flex-col justify-center">
              <div className="mb-8">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-3xl text-yellow-400">★</span>
                ))}
              </div>
              <blockquote className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
                "{testimonials[activeTestimonial].text}"
              </blockquote>
              <div>
                <p className="font-semibold text-gray-900">{testimonials[activeTestimonial].author}</p>
                <p className="text-gray-600">{testimonials[activeTestimonial].company}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === activeTestimonial ? 'bg-gray-900 w-8' : 'bg-gray-300 w-2'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Pricing That Matches Your Goals and Budget
            </h2>
            <p className="text-lg text-gray-600">
              Custom plans designed to fit your project needs—no fluff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <div
                key={index}
                className="group bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-900 hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                <div className="mb-6">
                  {plan.price ? (
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      ${plan.price}
                      <span className="text-lg text-gray-600 font-normal">/month</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-semibold text-gray-600">Custom Pricing</div>
                  )}
                  <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors font-semibold group-hover:shadow-lg"
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Building the Future with Strategic Design
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Design your vibe, create with passion.
          </p>
          <button
            onClick={() => setShowContactForm(true)}
            className="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all font-semibold text-lg"
          >
            Let's Talk
          </button>
        </div>
      </section>

      <footer className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 Lovelli Philippines. All rights reserved.</p>
        </div>
      </footer>

      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
    </div>
  );
}

export default App;
