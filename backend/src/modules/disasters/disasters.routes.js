const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../../middlewares/auth');
const controller = require('./disasters.controller');

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', requireRole('super_admin', 'admin_pusdalops'), controller.create);
router.put('/:id', requireRole('super_admin', 'admin_pusdalops'), controller.update);
router.delete('/:id', requireRole('super_admin', 'admin_pusdalops'), controller.remove);

module.exports = router;
