import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Globe, TrendingUp } from 'lucide-react';

export default function Careers() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Users,
      title: 'Global Team',
      description: 'Join talented professionals from around the world',
    },
    {
      icon: Globe,
      title: 'Remote Work',
      description: 'Work from anywhere with flexible schedules',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Continuous learning and advancement opportunities',
    },
  ];

  return (
    <section className="py-32 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-4">Join Our Team</p>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Build your career with us
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              We're always looking for talented individuals who are passionate about digital
              excellence and want to make an impact with global brands.
            </p>
            <button
              onClick={() => navigate('/apply')}
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-lg font-medium hover:bg-gray-200 transition-colors group"
            >
              View Open Positions
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="space-y-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex gap-6 items-start">
                  <div className="bg-white/10 p-4 flex-shrink-0">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-gray-300 text-lg">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
