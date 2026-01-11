export default function Blog() {
  const posts = [
    {
      category: 'INSIGHTS',
      date: 'Jan 10, 2025',
      title: 'The Future of Digital Marketing',
      description: 'Exploring emerging trends and technologies shaping the industry.',
      image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      category: 'STORIES',
      date: 'Jan 5, 2025',
      title: 'Creating Memorable Brand Experiences',
      description: 'How thoughtful design connects people to brands.',
      image: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      category: 'INSIGHTS',
      date: 'Dec 28, 2024',
      title: 'Strategic Partnerships That Work',
      description: 'Building collaborative relationships for long-term success.',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  return (
    <section id="blog" className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">Blog</p>
            <h2 className="text-5xl md:text-6xl font-bold text-black">
              And don't get FOMO.
            </h2>
          </div>
          <button className="hidden md:block border-2 border-black text-black px-8 py-3 text-sm font-medium hover:bg-black hover:text-white transition-all">
            VIEW ALL
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article key={index} className="group cursor-pointer">
              <div className="relative h-80 overflow-hidden mb-6">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="font-medium">{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-black group-hover:text-gray-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {post.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <button className="border-2 border-black text-black px-8 py-3 text-sm font-medium hover:bg-black hover:text-white transition-all">
            VIEW ALL
          </button>
        </div>
      </div>
    </section>
  );
}
