import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;
