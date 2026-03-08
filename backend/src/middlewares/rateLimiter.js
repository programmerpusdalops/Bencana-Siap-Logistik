const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for login endpoints.
 * Maximum 5 login attempts per minute per IP address.
 */
const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 1 minute.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * General API rate limiter.
 * Maximum 100 requests per minute per IP address.
 */
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: {
        success: false,
        message: 'Too many requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    loginLimiter,
    apiLimiter,
};
