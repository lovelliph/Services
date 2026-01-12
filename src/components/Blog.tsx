import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  author: string;
}

const defaultPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Digital Marketing',
    slug: 'future-digital-marketing',
    excerpt: 'Exploring emerging trends and technologies shaping the industry.',
    featured_image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
    published_at: '2025-01-10',
    author: 'Lovelli'
  },
  {
    id: '2',
    title: 'Creating Memorable Brand Experiences',
    slug: 'memorable-brand-experiences',
    excerpt: 'How thoughtful design connects people to brands.',
    featured_image: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=800',
    published_at: '2025-01-05',
    author: 'Lovelli'
  },
  {
    id: '3',
    title: 'Strategic Partnerships That Work',
    slug: 'strategic-partnerships',
    excerpt: 'Building collaborative relationships for long-term success.',
    featured_image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    published_at: '2024-12-28',
    author: 'Lovelli'
  }
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('id, title, slug, excerpt, featured_image, published_at, author')
          .order('published_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        if (data && data.length > 0) {
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
          {posts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <div className="relative h-80 overflow-hidden mb-6">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="font-medium">{post.author.toUpperCase()}</span>
                  <span>{formatDate(post.published_at)}</span>
                </div>
                <h3 className="text-2xl font-bold text-black group-hover:text-gray-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {post.excerpt}
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
