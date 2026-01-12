import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Users, FileText, Briefcase, Mail } from 'lucide-react';

interface Stats {
  blogs: number;
  projects: number;
  services: number;
  inquiries: number;
}

export default function Dashboard() {
  const { adminUser } = useAuth();
  const [stats, setStats] = useState<Stats>({
    blogs: 0,
    projects: 0,
    services: 0,
    inquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [blogsResult, projectsResult, servicesResult, inquiriesResult] = await Promise.all([
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('contact_inquiries').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        blogs: blogsResult.count || 0,
        projects: projectsResult.count || 0,
        services: servicesResult.count || 0,
        inquiries: inquiriesResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Blog Posts',
      value: stats.blogs,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: Briefcase,
      color: 'bg-green-500',
    },
    {
      title: 'Services',
      value: stats.services,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Inquiries',
      value: stats.inquiries,
      icon: Mail,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, <span className="font-medium">{adminUser?.email}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Role: <span className="font-medium capitalize">{adminUser?.role.replace('_', ' ')}</span>
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="bg-white p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                    </div>
                    <div className={`${card.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 border border-gray-200 hover:border-black transition-colors">
                  <span className="font-medium">Create New Blog Post</span>
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-200 hover:border-black transition-colors">
                  <span className="font-medium">Add New Project</span>
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-200 hover:border-black transition-colors">
                  <span className="font-medium">Manage Services</span>
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-200 hover:border-black transition-colors">
                  <span className="font-medium">View Contact Inquiries</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">No recent activity to display.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
