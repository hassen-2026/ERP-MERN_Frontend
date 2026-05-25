

import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const normalizeRole = (role) => String(role || '').trim().toLowerCase();

const roleToDashboardPath = (role) => {
  const r = normalizeRole(role);
  if (r.includes('admin')) return '/dashboard/admin';
  if (r.includes('finance')) return '/dashboard/finance';
  if (r.includes('procurement')) return '/dashboard/procurement';
  if (r.includes('sales')) return '/dashboard/sales';
  if (r.includes('hr')) return '/dashboard/hr';
  if (r.includes('logistics')) return '/dashboard/logistics';
  if (r.includes('manager')) return '/dashboard/manager';
  return '/dashboard/user';
};

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
      // Authenticated but not authorized -> send to their dashboard instead of login
      const redirectTo = roleToDashboardPath(role);
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
};

export default PrivateRoute;



