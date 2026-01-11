export default function Pricing() {
  const packages = [
    {
      name: 'Essence',
      description: 'Essential tools for a quick launch.',
      features: [
        'Brand Identity',
        '3D Images',
        'Floor Plans',
        'Commercial Booklet',
        'Website',
        'Photography'
      ]
    },
    {
      name: 'Core',
      description: 'For mid-sized enterprises.',
      features: [
        'Brand Identity',
        '3D Images',
        'Floor Plans',
        'Commercial Booklet',
        'Website',
        'Photography',
        'Virtual Tours'
      ],
      featured: true
    },
    {
      name: 'Signature',
      description: 'For high-impact, full-scale campaigns.',
      features: [
        'Brand Identity',
        '3D Images',
        'Floor Plans',
        'Commercial Booklet',
        'Website',
        'Photography',
        'Virtual Tours',
        'Promotional Film'
      ]
    }
  ];

  return (
    <section id="contact" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">Pricing</p>
          <h2 className="text-5xl md:text-6xl font-bold text-black">
            Let's frame your vision
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`border-2 p-8 transition-all duration-300 ${
                pkg.featured
                  ? 'border-black bg-black text-white scale-105'
                  : 'border-gray-200 hover:border-black'
              }`}
            >
              <h3 className="text-3xl font-bold mb-3">{pkg.name}</h3>
              <p className={`mb-8 ${pkg.featured ? 'text-gray-300' : 'text-gray-600'}`}>
                {pkg.description}
              </p>

              <ul className="space-y-4 mb-10">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className={`text-sm ${pkg.featured ? 'text-gray-300' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 text-sm font-medium transition-all ${
                  pkg.featured
                    ? 'bg-white text-black hover:bg-gray-100'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                KNOW MORE
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
