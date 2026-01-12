import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  client: string;
  featured: boolean;
}

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'Global Brand Campaign',
    slug: 'global-brand-campaign',
    description: 'A comprehensive digital marketing campaign for a Fortune 500 company.',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920',
    category: 'Digital Marketing',
    client: 'Tech Company',
    featured: true
  },
  {
    id: '2',
    title: 'Social Media Transformation',
    slug: 'social-media-transformation',
    description: 'Complete social media overhaul and community building strategy.',
    image: 'https://images.pexels.com/photos/3182783/pexels-photo-3182783.jpeg?auto=compress&cs=tinysrgb&w=1920',
    category: 'Social Media',
    client: 'Fashion Brand',
    featured: true
  },
  {
    id: '3',
    title: 'Content Creation Series',
    slug: 'content-creation-series',
    description: 'Monthly content production including videos, articles, and graphics.',
    image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=1920',
    category: 'Content',
    client: 'E-commerce',
    featured: true
  }
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, slug, description, image, category, client, featured')
          .eq('featured', true);

        if (error) throw error;

        if (data && data.length > 0) {
          setProjects(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="works" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">Works</p>
            <h2 className="text-5xl md:text-6xl font-bold text-black">
              Featured Projects
            </h2>
          </div>
          <button className="hidden md:block border-2 border-black text-black px-8 py-3 text-sm font-medium hover:bg-black hover:text-white transition-all">
            VIEW ALL
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <article key={project.id} className="group cursor-pointer">
              <div className="relative h-80 overflow-hidden mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="font-medium">{project.category.toUpperCase()}</span>
                  <span>{project.client}</span>
                </div>
                <h3 className="text-2xl font-bold text-black group-hover:text-gray-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {project.description}
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
