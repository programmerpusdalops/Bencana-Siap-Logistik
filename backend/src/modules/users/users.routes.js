const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const { authenticate, requireRole } = require('../../middlewares/auth');

// All user routes require authentication + super_admin role
router.use(authenticate);
router.use(requireRole('super_admin'));

// GET /api/users/roles - Get all roles (must be before /:id)
router.get('/roles', usersController.getRoles);

// GET /api/users/instansi - Get all instansi (must be before /:id)
router.get('/instansi', usersController.getInstansi);

// GET /api/users - List all users
router.get('/', usersController.getAll);

// GET /api/users/:id - Get user by ID
router.get('/:id', usersController.getById);

// POST /api/users - Create user
router.post('/', usersController.create);

// PUT /api/users/:id - Update user
router.put('/:id', usersController.update);

// DELETE /api/users/:id - Delete user
router.delete('/:id', usersController.remove);

module.exports = router;
