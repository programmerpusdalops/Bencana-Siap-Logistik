const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');

/**
 * Login user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {object} { token, user }
 */
const login = async (email, password) => {
    // 1. Find user by email, include role
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            role: {
                select: { name: true },
            },
            instansi: {
                select: { nama_instansi: true },
            },
        },
    });

    if (!user) {
        throw new AppError('Email atau password salah', 401);
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError('Email atau password salah', 401);
    }

    // 3. Generate JWT token
    const tokenPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    // 4. Return token and user info (without password)
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.name,
            instansi: user.instansi?.nama_instansi || null,
        },
    };
};

module.exports = {
    login,
};
