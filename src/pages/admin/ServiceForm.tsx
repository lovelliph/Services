import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Plus, X, Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface ServiceFormData {
  title: string;
  slug: string;
  description: string;
  long_description: string;
  image: string;
  features: string[];
  benefits: string[];
  order: number;
}

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    slug: '',
    description: '',
    long_description: '',
    image: '',
    features: [],
    benefits: [],
    order: 1,
  });

  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing) {
      fetchService();
    } else {
      fetchNextOrder();
    }
  }, [id]);

  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    }
  }, [formData.image]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        long_description: data.long_description || '',
        image: data.image || '',
        features: data.features || [],
        benefits: data.benefits || [],
        order: data.order || 1,
      });
    } catch (err) {
      console.error('Error fetching service:', err);
      setError('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const fetchNextOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('order')
        .order('order', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      setFormData(prev => ({
        ...prev,
        order: data ? data.order + 1 : 1,
      }));
    } catch (err) {
      console.error('Error fetching next order:', err);
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

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
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

    if (formData.features.length === 0) {
      errors.features = 'At least one feature is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkSlugUniqueness = async (slug: string) => {
    const { data, error } = await supabase
      .from('services')
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
          .from('services')
          .update({
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            long_description: formData.long_description,
            image: formData.image,
            features: formData.features,
            benefits: formData.benefits,
            order: formData.order,
          })
          .eq('id', id);

        if (error) throw error;
        setSuccess('Service updated successfully!');
      } else {
        const { error } = await supabase
          .from('services')
          .insert({
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            long_description: formData.long_description,
            image: formData.image,
            features: formData.features,
            benefits: formData.benefits,
            order: formData.order,
          });

        if (error) throw error;
        setSuccess('Service created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/services');
      }, 1500);
    } catch (err: any) {
      console.error('Error saving service:', err);
      setError(err.message || 'Failed to save service');
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
        to="/admin/services"
        className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:text-gray-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Services
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditing ? 'Edit Service' : 'Create New Service'}
        </h1>
        <p className="text-gray-600">
          {isEditing ? 'Update service details' : 'Add a new service to your offerings'}
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
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full px-4 py-2 border ${
                  validationErrors.title ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                placeholder="e.g., Digital Marketing"
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
                placeholder="e.g., digital-marketing"
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
                Short Description <span className="text-red-600">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-2 border ${
                  validationErrors.description ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                placeholder="Brief description for cards and previews"
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            <div>
              <label htmlFor="long_description" className="block text-sm font-medium text-gray-700 mb-2">
                Long Description
              </label>
              <textarea
                id="long_description"
                value={formData.long_description}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Detailed description for the service detail page"
              />
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                id="order"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Lower numbers appear first
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Image</h3>

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

        <div className="bg-white shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Features <span className="text-red-600">*</span>
          </h3>

          {validationErrors.features && (
            <p className="mb-4 text-sm text-red-600">{validationErrors.features}</p>
          )}

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="e.g., SEO Optimization"
              />
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            {formData.features.length > 0 && (
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                    <span className="flex-1 text-sm text-gray-900">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Benefits</h3>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="e.g., Increase brand visibility and reach"
              />
              <button
                type="button"
                onClick={addBenefit}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            {formData.benefits.length > 0 && (
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                    <span className="flex-1 text-sm text-gray-900">{benefit}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Link
            to="/admin/services"
            className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Service' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
}
