

import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const normalizeRole = (role) => String(role || '').trim().toLowerCase();

const PrivateRoute = ({ children, allowedRoles = null }) => {
  const token = useSelector((state) => state.user?.token);
  const role = useSelector((state) => state.user?.user?.role || state.user?.user?.type);
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const currentRole = normalizeRole(role);
    const roleAllowed = allowedRoles.map(normalizeRole).includes(currentRole);

    if (!roleAllowed) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;




