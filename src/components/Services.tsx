import { useState } from 'react';

export default function Services() {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      number: '01',
      title: 'Brand Identity',
      description: 'From concept to icon, your brand\'s journey starts here.',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      number: '02',
      title: 'Visual Content',
      description: 'Every picture is a narrative waiting to be told.',
      image: 'https://images.pexels.com/photos/3182783/pexels-photo-3182783.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      number: '03',
      title: 'Video Production',
      description: 'From real-world shoots to boundless 3D worlds, every frame tells a story.',
      image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      number: '04',
      title: 'Digital Experience',
      description: 'Blurring borders between reality and digital innovation.',
      image: 'https://images.pexels.com/photos/3182769/pexels-photo-3182769.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      number: '05',
      title: 'Website Design',
      description: 'Websites that transform ideas into measurable results.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1920'
    }
  ];

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
              {services[activeService].number}
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-black mb-6">
              {services[activeService].title}
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {services[activeService].description}
            </p>
            <button className="border-2 border-black text-black px-8 py-3 text-sm font-medium hover:bg-black hover:text-white transition-all">
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
