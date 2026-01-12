import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  features: string[];
}

const defaultServices: Service[] = [
  {
    id: '1',
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Strategic campaigns that drive engagement, build brand awareness, and deliver measurable results across all digital channels.',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920',
    order: 1,
    features: []
  },
  {
    id: '2',
    title: 'Social Media Management',
    slug: 'social-media-management',
    description: 'Curated content strategies and community management that transform your brand presence into a thriving digital community.',
    image: 'https://images.pexels.com/photos/3182783/pexels-photo-3182783.jpeg?auto=compress&cs=tinysrgb&w=1920',
    order: 2,
    features: []
  },
  {
    id: '3',
    title: 'Content Creation',
    slug: 'content-creation',
    description: 'Original, compelling content crafted to resonate with your audience and amplify your brand message across platforms.',
    image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=1920',
    order: 3,
    features: []
  },
  {
    id: '4',
    title: 'Influencer & UGC Management',
    slug: 'influencer-ugc-management',
    description: 'Authentic partnerships with influencers and user-generated content strategies that amplify your reach and credibility.',
    image: 'https://images.pexels.com/photos/3182769/pexels-photo-3182769.jpeg?auto=compress&cs=tinysrgb&w=1920',
    order: 4,
    features: []
  },
  {
    id: '5',
    title: 'Creative Production & BPO',
    slug: 'creative-production-bpo',
    description: 'Full-service creative and business solutions delivered by skilled Filipino professionals working remotely for global excellence.',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1920',
    order: 5,
    features: []
  }
];

export default function Services() {
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState(0);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('order', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setServices(data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id="services" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
            What you build is beautiful.
          </h2>
          <h2 className="text-5xl md:text-7xl font-bold text-gray-400 leading-tight">
            But is beauty enough?
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => setActiveService(index)}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                activeService === index
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-8xl font-bold text-gray-200 mb-4">
              {String(activeService + 1).padStart(2, '0')}
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-black mb-6">
              {services[activeService].title}
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {services[activeService].description}
            </p>
            <button
              onClick={() => navigate(`/services/${services[activeService].slug}`)}
              className="border-2 border-black text-black px-8 py-3 text-sm font-medium hover:bg-black hover:text-white transition-all"
            >
              LEARN MORE
            </button>
          </div>

          <div className="relative h-[600px] overflow-hidden">
            <img
              src={services[activeService].image}
              alt={services[activeService].title}
              className="w-full h-full object-cover transition-all duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
