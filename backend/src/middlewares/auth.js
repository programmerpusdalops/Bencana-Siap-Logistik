const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

/**
 * Authentication middleware.
 * Verifies JWT token from Authorization header.
 */
const authenticate = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Unauthorized', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return next(new AppError('Unauthorized', 401));
        }
        next(error);
    }
};

/**
 * Role-based authorization middleware.
 * Restricts access to specific roles.
 * @param  {...string} roles - Allowed roles
 */
const requireRole = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new AppError('Unauthorized', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError('Forbidden: insufficient permissions', 403));
        }

        next();
    };
};

module.exports = {
    authenticate,
    requireRole,
};
