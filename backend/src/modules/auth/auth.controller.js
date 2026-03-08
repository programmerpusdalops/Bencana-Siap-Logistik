const authService = require('./auth.service');
const { successResponse } = require('../../utils/responseHelper');
const AppError = require('../../utils/AppError');

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token.
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            throw new AppError('Email dan password wajib diisi', 400);
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new AppError('Format email tidak valid', 400);
        }

        const result = await authService.login(email, password);

        return successResponse(res, result, 'Login successful');
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/auth/me
 * Return current authenticated user info from JWT token.
 */
const getMe = async (req, res, next) => {
    try {
        // req.user is set by the authenticate middleware
        return successResponse(res, { user: req.user }, 'User retrieved successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    getMe,
};
