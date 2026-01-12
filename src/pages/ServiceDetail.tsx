import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  features: string[];
  long_description?: string;
  benefits?: string[];
}

const serviceDefaults: Record<string, Service> = {
  'digital-marketing': {
    id: '1',
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Strategic campaigns that drive engagement, build brand awareness, and deliver measurable results across all digital channels.',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920',
    order: 1,
    features: ['SEO Optimization', 'PPC Campaigns', 'Email Marketing', 'Analytics & Reporting', 'Conversion Optimization', 'Market Research'],
    long_description: 'Our digital marketing services combine data-driven strategies with creative execution to help your brand stand out in the digital landscape. We focus on measurable results and continuous optimization to ensure your marketing investments deliver maximum ROI.',
    benefits: [
      'Increase brand visibility and reach',
      'Drive qualified traffic to your website',
      'Improve conversion rates and customer acquisition',
      'Build long-term customer relationships',
      'Gain competitive market advantage'
    ]
  },
  'social-media-management': {
    id: '2',
    title: 'Social Media Management',
    slug: 'social-media-management',
    description: 'Curated content strategies and community management that transform your brand presence into a thriving digital community.',
    image: 'https://images.pexels.com/photos/3182783/pexels-photo-3182783.jpeg?auto=compress&cs=tinysrgb&w=1920',
    order: 2,
    features: ['Content Strategy', 'Community Management', 'Social Media Advertising', 'Platform Optimization', 'Engagement Analytics', 'Influencer Collaboration'],
    long_description: 'We create and execute comprehensive social media strategies that build authentic connections with your audience. Our team manages your social presence across all platforms, ensuring consistent brand messaging and meaningful engagement.',
    benefits: [
      'Build engaged social communities',
      'Increase brand awareness and loyalty',
      'Drive traffic and conversions from social',
      'Enhance customer service through social channels',
      'Stay ahead of social media trends'
    ]
  },
  'content-creation': {
    id: '3',
    title: 'Content Creation',
    slug: 'content-creation',
    description: 'Original, compelling content crafted to resonate with your audience and amplify your brand message across platforms.',
    image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=1920',
    order: 3,
    features: ['Video Production', 'Photography', 'Copywriting', 'Graphic Design', 'Blog Content', 'Interactive Media'],
    long_description: 'From concept to execution, we produce high-quality content that tells your brand story and engages your audience. Our creative team specializes in various content formats, ensuring your message reaches and resonates with your target audience.',
    benefits: [
      'Establish thought leadership in your industry',
      'Improve SEO with quality content',
      'Increase audience engagement',
      'Support sales enablement',
      'Build brand credibility and trust'
    ]
  },
  'influencer-ugc-management': {
    id: '4',
    title: 'Influencer & UGC Management',
    slug: 'influencer-ugc-management',
    description: 'Authentic partnerships with influencers and user-generated content strategies that amplify your reach and credibility.',
    image: 'https://images.pexels.com/photos/3182769/pexels-photo-3182769.jpeg?auto=compress&cs=tinysrgb&w=1920',
    order: 4,
    features: ['Influencer Sourcing', 'Campaign Management', 'UGC Strategy', 'Rights Management', 'Performance Tracking', 'Brand Safety'],
    long_description: 'Leverage the power of authentic voices to amplify your brand message. We connect you with the right influencers and manage comprehensive campaigns that drive awareness, engagement, and conversions through trusted recommendations.',
    benefits: [
      'Expand reach through trusted voices',
      'Build authentic brand connections',
      'Generate social proof at scale',
      'Increase conversion rates',
      'Access new audience segments'
    ]
  },
  'creative-production-bpo': {
    id: '5',
    title: 'Creative Production & BPO',
    slug: 'creative-production-bpo',
    description: 'Full-service creative and business solutions delivered by skilled Filipino professionals working remotely for global excellence.',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1920',
    order: 5,
    features: ['Remote Teams', 'Design Services', 'Administrative Support', 'Customer Service', 'Data Management', 'Technical Support'],
    long_description: 'Access world-class talent without the overhead. Our BPO services connect you with highly skilled Filipino professionals who deliver exceptional results across creative, administrative, and technical domains, all while working remotely.',
    benefits: [
      'Reduce operational costs significantly',
      'Access skilled talent pool',
      'Scale teams flexibly',
      'Improve operational efficiency',
      'Focus on core business activities'
    ]
  }
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setService(data);
        } else {
          setService(serviceDefaults[slug] || null);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        setService(serviceDefaults[slug!] || null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Service not found</h2>
          <Link to="/" className="text-black underline">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.6)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {service.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              {service.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <Link
          to="/#services"
          className="inline-flex items-center gap-2 text-sm font-medium mb-12 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              What We Offer
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {service.long_description || service.description}
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-black mb-6">Key Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-black flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {service.benefits && service.benefits.length > 0 && (
          <div className="bg-gray-50 p-12 mb-20">
            <h3 className="text-3xl font-bold text-black mb-8 text-center">
              Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6">
                  <div className="text-4xl font-bold text-gray-200 mb-3">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center bg-black text-white p-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to get started?
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help elevate your brand with our {service.title.toLowerCase()} services.
          </p>
          <Link
            to="/#contact"
            className="inline-block bg-white text-black px-8 py-4 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            GET IN TOUCH
          </Link>
        </div>
      </div>
    </div>
  );
}
