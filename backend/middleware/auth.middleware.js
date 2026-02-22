// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.',
      message: 'Please provide a valid authentication token'
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Ugonna');
    
    // Add user info to request object
    req.user = decoded;
    
    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please login again.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        error: 'Invalid token',
        message: 'Authentication failed. Please login again.'
      });
    }
    
    return res.status(403).json({ 
      error: 'Authentication failed',
      message: error.message
    });
  }
};

// Optional: Middleware for optional authentication (doesn't require token but verifies if present)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Ugonna');
      req.user = decoded;
    } catch (error) {
      // Token is invalid but we don't block the request
      console.log('Optional auth: Invalid token provided');
    }
  }
  
  next();
};

// Optional: Middleware for role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please login to access this resource'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You do not have permission to access this resource'
      });
    }
    
    next();
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  authorize
};