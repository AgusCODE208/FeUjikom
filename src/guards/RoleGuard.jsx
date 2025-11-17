import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

const RoleGuard = ({ children, allowedRoles }) => {
  const { isAuthenticated, hasAnyRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleGuard;
