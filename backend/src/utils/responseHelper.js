/**
 * Standard API response helpers
 * All API responses use these to maintain consistent format.
 */

const successResponse = (res, data = null, message = 'Operation successful', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

const errorResponse = (res, message = 'Internal server error', statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};

const paginatedResponse = (res, items, pagination, message = 'Data retrieved successfully') => {
    return res.status(200).json({
        success: true,
        message,
        data: {
            items,
            pagination,
        },
    });
};

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse,
};
