const usersService = require('./users.service');
const { successResponse, paginatedResponse } = require('../../utils/responseHelper');
const AppError = require('../../utils/AppError');

/**
 * GET /api/users
 * List all users with pagination and search.
 */
const getAll = async (req, res, next) => {
    try {
        const result = await usersService.getAllUsers(req.query);
        return paginatedResponse(res, result.items, result.pagination, 'Data user berhasil diambil');
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/users/:id
 * Get a single user by ID.
 */
const getById = async (req, res, next) => {
    try {
        const user = await usersService.getUserById(req.params.id);
        return successResponse(res, user, 'Data user berhasil diambil');
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/users
 * Create a new user.
 */
const create = async (req, res, next) => {
    try {
        const { name, email, password, role_id } = req.body;

        // Validation
        if (!name || !email || !password || !role_id) {
            throw new AppError('Nama, email, password, dan role wajib diisi', 400);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new AppError('Format email tidak valid', 400);
        }

        if (password.length < 6) {
            throw new AppError('Password minimal 6 karakter', 400);
        }

        const user = await usersService.createUser(req.body);
        return successResponse(res, user, 'User berhasil dibuat', 201);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/users/:id
 * Update an existing user.
 */
const update = async (req, res, next) => {
    try {
        if (req.body.password && req.body.password.length < 6) {
            throw new AppError('Password minimal 6 karakter', 400);
        }

        const user = await usersService.updateUser(req.params.id, req.body);
        return successResponse(res, user, 'User berhasil diperbarui');
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/users/:id
 * Delete a user.
 */
const remove = async (req, res, next) => {
    try {
        // Prevent self-deletion
        if (parseInt(req.params.id) === req.user.id) {
            throw new AppError('Tidak dapat menghapus akun sendiri', 400);
        }

        await usersService.deleteUser(req.params.id);
        return successResponse(res, null, 'User berhasil dihapus');
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/users/roles
 * Get all available roles (for dropdown).
 */
const getRoles = async (_req, res, next) => {
    try {
        const roles = await usersService.getRoles();
        return successResponse(res, roles, 'Data roles berhasil diambil');
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/users/instansi
 * Get all available instansi (for dropdown).
 */
const getInstansi = async (_req, res, next) => {
    try {
        const instansi = await usersService.getInstansi();
        return successResponse(res, instansi, 'Data instansi berhasil diambil');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    getRoles,
    getInstansi,
};
