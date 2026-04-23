import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isAuthenticated, getCurrentUser } from '../utils/auth.js';

export function ProtectedRoute({ role, children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin') {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
      return <Navigate to="/blogs" replace />;
    }
  }

  return children;
}

ProtectedRoute.propTypes = {
  role: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ProtectedRoute.defaultProps = {
  role: null,
};

export default ProtectedRoute;