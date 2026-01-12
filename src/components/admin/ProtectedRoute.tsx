import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'viewer' | 'editor' | 'admin' | 'super_admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, adminUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !adminUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!adminUser.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Inactive</h2>
          <p className="text-gray-600 mb-6">
            Your admin account has been deactivated. Please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  if (requiredRole) {
    const roleHierarchy = {
      viewer: 0,
      editor: 1,
      admin: 2,
      super_admin: 3,
    };

    if (roleHierarchy[adminUser.role] < roleHierarchy[requiredRole]) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
