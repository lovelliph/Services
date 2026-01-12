import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import ServiceDetail from './pages/ServiceDetail';
import Footer from './components/Footer';
import MobileMenu from './components/MobileMenu';
import Login from './pages/admin/Login';
import ForgotPassword from './pages/admin/ForgotPassword';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const goHome = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-md shadow-sm' : location.pathname !== '/' ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <button onClick={goHome}>
              <img src="/logo.png" alt="Lovelli" className="h-8 cursor-pointer" />
            </button>

            <div className="hidden lg:flex items-center gap-12">
              <button onClick={() => scrollToSection('works')} className="text-sm font-medium hover:text-gray-600 transition-colors">
                WORKS
              </button>
              <button onClick={() => scrollToSection('services')} className="text-sm font-medium hover:text-gray-600 transition-colors">
                SERVICES
              </button>
              <button onClick={() => scrollToSection('about')} className="text-sm font-medium hover:text-gray-600 transition-colors">
                ABOUT
              </button>
              <button onClick={() => scrollToSection('blog')} className="text-sm font-medium hover:text-gray-600 transition-colors">
                BLOG
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-black text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                GET IN TOUCH
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        scrollToSection={scrollToSection}
      />
    </>
  );
}

function ScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const id = (location.state as any).scrollTo;
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <ScrollHandler />
      {children}
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/services/:slug" element={<PublicLayout><ServiceDetail /></PublicLayout>} />

          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
