/**
 * Global error handling middleware.
 * Catches all errors and returns a standardized JSON response.
 * Never exposes raw database errors or stack traces to the client.
 */
const errorHandler = (err, req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const isOperational = err.isOperational || false;

    // Log full error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', {
            message: err.message,
            stack: err.stack,
            statusCode,
        });
    } else {
        // In production, only log non-operational (unexpected) errors
        if (!isOperational) {
            console.error('Unexpected Error:', err);
        }
    }

    return res.status(statusCode).json({
        success: false,
        message: isOperational ? err.message : 'Internal server error',
    });
};

module.exports = errorHandler;
