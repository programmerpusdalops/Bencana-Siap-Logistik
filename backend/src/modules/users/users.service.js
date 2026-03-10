const prisma = require('../../config/database');
const bcrypt = require('bcryptjs');
const AppError = require('../../utils/AppError');

/**
 * Get all users with their role and instansi.
 * @param {object} query - { page, limit, search }
 * @returns {object} { items, pagination }
 */
const getAllUsers = async (query = {}) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = query.search || '';

    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ],
        }
        : {};

    const [items, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role_id: true,
                instansi_id: true,
                created_at: true,
                updated_at: true,
                role: { select: { id: true, name: true } },
                instansi: { select: { id: true, nama_instansi: true } },
            },
        }),
        prisma.user.count({ where }),
    ]);

    return {
        items: items.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role.name,
            role_id: u.role_id,
            instansi: u.instansi?.nama_instansi || null,
            instansi_id: u.instansi_id,
            created_at: u.created_at,
        })),
        pagination: {
            page,
            limit,
            total_items: total,
            total_pages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get a single user by ID.
 */
const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
            id: true,
            name: true,
            email: true,
            role_id: true,
            instansi_id: true,
            created_at: true,
            role: { select: { id: true, name: true } },
            instansi: { select: { id: true, nama_instansi: true } },
        },
    });

    if (!user) {
        throw new AppError('User tidak ditemukan', 404);
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        role_id: user.role_id,
        instansi: user.instansi?.nama_instansi || null,
        instansi_id: user.instansi_id,
        created_at: user.created_at,
    };
};

/**
 * Create a new user.
 * @param {object} data - { name, email, password, role_id, instansi_id }
 */
const createUser = async (data) => {
    const { name, email, password, role_id, instansi_id } = data;

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw new AppError('Email sudah terdaftar', 400);
    }

    // Verify role exists
    const role = await prisma.role.findUnique({ where: { id: parseInt(role_id) } });
    if (!role) {
        throw new AppError('Role tidak ditemukan', 400);
    }

    // Verify instansi exists (if provided)
    if (instansi_id) {
        const instansi = await prisma.instansi.findUnique({ where: { id: parseInt(instansi_id) } });
        if (!instansi) {
            throw new AppError('Instansi tidak ditemukan', 400);
        }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role_id: parseInt(role_id),
            instansi_id: instansi_id ? parseInt(instansi_id) : null,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: { select: { name: true } },
            instansi: { select: { nama_instansi: true } },
            created_at: true,
        },
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        instansi: user.instansi?.nama_instansi || null,
        created_at: user.created_at,
    };
};

/**
 * Update an existing user.
 * @param {number} id
 * @param {object} data - { name, email, password, role_id, instansi_id }
 */
const updateUser = async (id, data) => {
    const userId = parseInt(id);

    // Check user exists
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
        throw new AppError('User tidak ditemukan', 404);
    }

    // If email changed, check uniqueness
    if (data.email && data.email !== existing.email) {
        const emailTaken = await prisma.user.findUnique({ where: { email: data.email } });
        if (emailTaken) {
            throw new AppError('Email sudah digunakan user lain', 400);
        }
    }

    // Build update payload
    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.role_id) updateData.role_id = parseInt(data.role_id);
    if (data.instansi_id !== undefined) {
        updateData.instansi_id = data.instansi_id ? parseInt(data.instansi_id) : null;
    }

    // If password provided, hash it
    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
            role: { select: { name: true } },
            instansi: { select: { nama_instansi: true } },
            created_at: true,
        },
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        instansi: user.instansi?.nama_instansi || null,
        created_at: user.created_at,
    };
};

/**
 * Delete a user.
 */
const deleteUser = async (id) => {
    const userId = parseInt(id);

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
        throw new AppError('User tidak ditemukan', 404);
    }

    await prisma.user.delete({ where: { id: userId } });

    return { id: userId };
};

/**
 * Get all roles (for dropdown).
 */
const getRoles = async () => {
    return prisma.role.findMany({
        orderBy: { id: 'asc' },
        select: { id: true, name: true },
    });
};

/**
 * Get all instansi (for dropdown).
 */
const getInstansi = async () => {
    return prisma.instansi.findMany({
        orderBy: { id: 'asc' },
        select: { id: true, nama_instansi: true },
    });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getRoles,
    getInstansi,
};
