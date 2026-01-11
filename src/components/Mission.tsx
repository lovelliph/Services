export default function Mission() {
  return (
    <section id="about" className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">Our Mission</p>
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8">
            We design with
          </h2>

          <div className="overflow-hidden py-4">
            <div className="animate-marquee whitespace-nowrap inline-block">
              <span className="text-5xl md:text-7xl font-bold text-gray-300 mx-8">partnership</span>
              <span className="text-5xl md:text-7xl font-bold text-black mx-8">intention</span>
              <span className="text-5xl md:text-7xl font-bold text-gray-300 mx-8">partnership</span>
              <span className="text-5xl md:text-7xl font-bold text-black mx-8">intention</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-24">
          <div className="relative h-[600px] overflow-hidden">
            <img
              src="https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Our mission"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-4xl md:text-5xl font-bold text-black mb-8 leading-tight">
              presenting your project as an icon in the market.
            </h3>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Art + Technology + Strategy are the pillars that sustain our relentless pursuit
                to showcase our clients' projects at the highest level of the global market.
              </p>
              <p>
                Regardless of historical heritage, architectural iconicity, or price range,
                any product can stand out in the market when presented the right way.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
