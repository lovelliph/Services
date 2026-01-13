import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  position_applied: string;
  experience_years: string;
  company_name: string;
  website_url: string;
  message: string;
  honeypot: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const positions = [
  'Digital Marketing Specialist',
  'Social Media Manager',
  'Content Creator',
  'Graphic Designer',
  'Video Editor',
  'SEO Specialist',
  'Copywriter',
  'Virtual Assistant',
  'Customer Service Representative',
  'Data Entry Specialist',
  'Web Developer',
  'Project Manager',
];

export default function Apply() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    position_applied: '',
    experience_years: '',
    company_name: '',
    website_url: '',
    message: '',
    honeypot: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [validationDebounce, setValidationDebounce] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const checkDuplicateEmail = async (email: string) => {
    if (!validateEmail(email)) return;

    try {
      const { data, error } = await supabase
        .from('applicants')
        .select('created_at')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const applicationDate = new Date(data.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        setDuplicateWarning(
          `You've already applied on ${applicationDate}. Thank you for your interest!`
        );
      } else {
        setDuplicateWarning('');
      }
    } catch (err) {
      console.error('Error checking duplicate:', err);
    }
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 100) return 'Name must be less than 100 characters';
        return '';

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
        return '';

      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!validatePhone(value)) return 'Please enter a valid phone number (min 10 digits)';
        return '';

      case 'position_applied':
        if (!value) return 'Please select a position';
        return '';

      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 50)
          return `Message must be at least 50 characters (${value.trim().length}/50)`;
        if (value.trim().length > 2000)
          return `Message must be less than 2000 characters (${value.trim().length}/2000)`;
        return '';

      case 'website_url':
        if (value && !validateUrl(value)) return 'Please enter a valid URL';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationDebounce) {
      clearTimeout(validationDebounce);
    }

    const timeout = setTimeout(() => {
      const error = validateField(name, value);
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }));

      if (name === 'email' && value) {
        checkDuplicateEmail(value);
      }
    }, 300);

    setValidationDebounce(timeout);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    errors.name = validateField('name', formData.name);
    errors.email = validateField('email', formData.email);
    errors.phone = validateField('phone', formData.phone);
    errors.position_applied = validateField('position_applied', formData.position_applied);
    errors.message = validateField('message', formData.message);

    if (formData.website_url) {
      errors.website_url = validateField('website_url', formData.website_url);
    }

    const filteredErrors = Object.entries(errors).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {} as ValidationErrors);

    setValidationErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.honeypot) {
      setError('Invalid submission detected');
      return;
    }

    if (!validateForm()) {
      setError('Please fix all validation errors before submitting');
      return;
    }

    setLoading(true);

    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const ipAddress = ipData.ip;

      const { data: rateLimitCheck, error: rateLimitError } = await supabase.rpc(
        'check_application_rate_limit',
        { p_ip_address: ipAddress }
      );

      if (rateLimitError) {
        console.error('Rate limit check error:', rateLimitError);
      }

      if (rateLimitCheck === false) {
        setError(
          'Too many applications from your location. Please try again in 24 hours.'
        );
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from('applicants').insert({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        position_applied: formData.position_applied,
        message: formData.message.trim(),
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        company_name: formData.company_name.trim() || null,
        website_url: formData.website_url.trim() || null,
        ip_address: ipAddress,
        status: 'new',
      });

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      if (err.code === '23505') {
        setError('You have already applied with this email address.');
      } else {
        setError(err.message || 'Failed to submit application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 shadow-sm border border-gray-200">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
              <p className="text-lg text-gray-600 mb-2">
                Thank you for your interest in joining our team.
              </p>
              <p className="text-gray-500">
                We've received your application and will review it carefully. If your qualifications
                match our requirements, we'll contact you within 5-7 business days.
              </p>
            </div>

            <div className="bg-gray-50 p-4 mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-gray-600 text-left space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-black font-bold">1.</span>
                  <span>Our team will review your application</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black font-bold">2.</span>
                  <span>Qualified candidates will be contacted for an interview</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black font-bold">3.</span>
                  <span>Check your email regularly for updates</span>
                </li>
              </ul>
            </div>

            <p className="text-sm text-gray-500 mb-4">Redirecting to homepage in 3 seconds...</p>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Back to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const characterCount = formData.message.length;
  const characterMin = 50;
  const characterMax = 2000;

  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Be part of a dynamic team delivering world-class BPO and creative services to global
            clients. We're looking for talented professionals ready to make an impact.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Form</h2>
            <p className="text-gray-600">
              Please fill out all required fields marked with an asterisk (*). We'll review your
              application and get back to you soon.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 mb-8 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {duplicateWarning && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 mb-8 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Application Found</p>
                <p className="text-sm">{duplicateWarning}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-black">
                Personal Information
              </h3>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="John Doe"
                  />
                  {validationErrors.name && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        validationErrors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                      placeholder="john@example.com"
                    />
                    {validationErrors.email && (
                      <p className="mt-2 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {validationErrors.phone && (
                      <p className="mt-2 text-sm text-red-600">{validationErrors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-black">
                Professional Background
              </h3>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="position_applied"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Position Applied For <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="position_applied"
                    name="position_applied"
                    value={formData.position_applied}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      validationErrors.position_applied ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                  >
                    <option value="">Select a position...</option>
                    {positions.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                  {validationErrors.position_applied && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.position_applied}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="experience_years"
                      className="block text-sm font-medium text-gray-900 mb-2"
                    >
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      id="experience_years"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="e.g., 5"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company_name"
                      className="block text-sm font-medium text-gray-900 mb-2"
                    >
                      Current/Previous Company
                    </label>
                    <input
                      type="text"
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      maxLength={100}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Company Name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="website_url"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Portfolio / Website URL
                  </label>
                  <input
                    type="url"
                    id="website_url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      validationErrors.website_url ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="https://yourportfolio.com"
                  />
                  {validationErrors.website_url && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.website_url}</p>
                  )}
                  {formData.website_url && !validationErrors.website_url && (
                    <a
                      href={formData.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-black hover:underline"
                    >
                      Preview: {formData.website_url}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-black">
                Cover Letter
              </h3>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                  Tell us about yourself <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={8}
                  maxLength={2000}
                  className={`w-full px-4 py-3 border ${
                    validationErrors.message ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                  placeholder="Share your relevant experience, skills, and why you'd be a great fit for this position..."
                />
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    {validationErrors.message && (
                      <p className="text-sm text-red-600">{validationErrors.message}</p>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      characterCount < characterMin
                        ? 'text-red-600'
                        : characterCount > characterMax
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {characterCount} / {characterMax} characters
                    {characterCount < characterMin && ` (minimum ${characterMin})`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading || !!duplicateWarning}
                className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
