const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../../middlewares/auth');
const controller = require('./requests.controller');

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', requireRole('super_admin', 'admin_pusdalops', 'petugas_posko'), controller.create);
router.patch('/:id/approve', requireRole('super_admin', 'admin_pusdalops'), controller.approve);
router.patch('/:id/reject', requireRole('super_admin', 'admin_pusdalops'), controller.reject);

module.exports = router;
