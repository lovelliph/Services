import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Upload, AlertCircle, CheckCircle, Star } from 'lucide-react';

interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  featured: boolean;
  client: string;
  link: string;
}

export default function ProjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    slug: '',
    description: '',
    image: '',
    category: '',
    featured: false,
    client: '',
    link: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing) {
      fetchProject();
    }
  }, [id]);

  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    }
  }, [formData.image]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        image: data.image || '',
        category: data.category || '',
        featured: data.featured || false,
        client: data.client || '',
        link: data.link || '',
      });
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.image.trim()) {
      errors.image = 'Image URL is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkSlugUniqueness = async (slug: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error checking slug:', error);
      return true;
    }

    if (isEditing) {
      return !data || data.id === id;
    }

    return !data;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setError('Please fix the validation errors');
      return;
    }

    const isSlugUnique = await checkSlugUniqueness(formData.slug);
    if (!isSlugUnique) {
      setValidationErrors(prev => ({
        ...prev,
        slug: 'This slug is already in use',
      }));
      setError('Slug must be unique');
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('projects')
          .update({
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            image: formData.image,
            category: formData.category,
            featured: formData.featured,
            client: formData.client,
            link: formData.link,
          })
          .eq('id', id);

        if (error) throw error;
        setSuccess('Project updated successfully!');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert({
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            image: formData.image,
            category: formData.category,
            featured: formData.featured,
            client: formData.client,
            link: formData.link,
          });

        if (error) throw error;
        setSuccess('Project created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/projects');
      }, 1500);
    } catch (err: any) {
      console.error('Error saving project:', err);
      setError(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/admin/projects"
        className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:text-gray-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditing ? 'Edit Project' : 'Create New Project'}
        </h1>
        <p className="text-gray-600">
          {isEditing ? 'Update project details' : 'Add a new project to your portfolio'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 mb-6 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h3>

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Project Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full px-4 py-2 border ${
                  validationErrors.title ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                placeholder="e.g., Global Brand Campaign"
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className={`w-full px-4 py-2 border ${
                  validationErrors.slug ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                placeholder="e.g., global-brand-campaign"
              />
              <p className="mt-1 text-xs text-gray-500">
                URL-friendly version of the title (lowercase, hyphens only)
              </p>
              {validationErrors.slug && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.slug}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full px-4 py-2 border ${
                  validationErrors.description ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                placeholder="Brief description of the project"
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g., Digital Marketing"
                />
              </div>

              <div>
                <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g., Tech Company"
                />
              </div>
            </div>

            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                Project Link
              </label>
              <input
                type="url"
                id="link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="https://example.com"
              />
              <p className="mt-1 text-xs text-gray-500">
                External link to the live project or case study
              </p>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4"
                />
                <div className="flex items-center gap-2">
                  <Star className={`h-5 w-5 ${formData.featured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium text-gray-700">
                    Featured Project (Display on homepage)
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Project Image</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className={`flex-1 px-4 py-2 border ${
                    validationErrors.image ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Browse
                </button>
              </div>
              {validationErrors.image && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>
              )}
            </div>

            {imagePreview && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-md h-64 object-cover border border-gray-200"
                  onError={() => setImagePreview('')}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Link
            to="/admin/projects"
            className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
