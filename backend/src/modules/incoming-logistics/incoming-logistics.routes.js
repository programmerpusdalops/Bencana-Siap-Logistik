/**
 * Incoming Logistics Routes
 * GET/POST /api/barang-masuk
 * Protected: authenticate + admin_gudang or super_admin for POST
 */

const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../../middlewares/auth');
const incomingController = require('./incoming-logistics.controller');

router.use(authenticate);

// GET /api/barang-masuk — all authenticated users can view
router.get('/', incomingController.getAll);
router.get('/:id', incomingController.getById);

// POST /api/barang-masuk — only admin_gudang or super_admin
router.post('/', requireRole('super_admin', 'admin_gudang'), incomingController.create);

module.exports = router;
