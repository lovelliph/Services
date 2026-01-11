import { useState } from 'react';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      quote: 'Working with this team has been an inspiring experience. Their deep knowledge combined with a dynamic and creative approach authentically captures the essence of our brand.',
      author: 'Sarah Mitchell',
      company: 'Tech Innovations',
      image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      quote: 'Their art direction and sensibility were outstanding, capturing the essence of the design with clarity and style. A rare level of care and commitment.',
      author: 'Michael Torres',
      company: 'Design Studio',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      quote: 'Excellent work and communication. They really made our job easy and delivered beyond expectations every single time.',
      author: 'Emma Richardson',
      company: 'Global Agency',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  return (
    <section id="works" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-black">
            We build trust.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[700px] overflow-hidden">
            <img
              src={testimonials[activeIndex].image}
              alt="Testimonial"
              className="w-full h-full object-cover transition-all duration-700"
            />
          </div>

          <div className="space-y-12">
            <div className="space-y-6">
              <p className="text-2xl md:text-3xl font-medium text-gray-700 leading-relaxed">
                "{testimonials[activeIndex].quote}"
              </p>
              <div>
                <p className="text-xl font-bold text-black">{testimonials[activeIndex].author}</p>
                <p className="text-lg text-gray-500">{testimonials[activeIndex].company}</p>
              </div>
            </div>

            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1 transition-all duration-300 ${
                    index === activeIndex ? 'w-12 bg-black' : 'w-8 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
