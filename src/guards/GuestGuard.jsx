import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import { ROLE_ROUTES } from '../constants/role';

const GuestGuard = ({ children }) => {
  const { isAuthenticated, getRole } = useAuthStore();

  if (isAuthenticated) {
    const userRole = getRole();
    const redirectTo = ROLE_ROUTES[userRole] || '/';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default GuestGuard;
