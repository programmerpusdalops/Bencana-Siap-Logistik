/**
 * Stock Routes
 * GET/POST/PUT/DELETE /api/stocks
 * Protected: authenticate + admin_gudang or super_admin
 */

const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../../middlewares/auth');
const stocksController = require('./stocks.controller');

router.use(authenticate);

// GET /api/stocks — all authenticated users can view stock
router.get('/', stocksController.getAll);
router.get('/:id', stocksController.getById);

// POST/PUT/DELETE — only admin_gudang or super_admin
router.post('/', requireRole('super_admin', 'admin_gudang'), stocksController.create);
router.put('/:id', requireRole('super_admin', 'admin_gudang'), stocksController.update);
router.delete('/:id', requireRole('super_admin', 'admin_gudang'), stocksController.remove);

module.exports = router;
