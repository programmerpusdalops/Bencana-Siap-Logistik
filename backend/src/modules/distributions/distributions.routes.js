const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../../middlewares/auth');
const controller = require('./distributions.controller');

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', requireRole('super_admin', 'admin_gudang', 'admin_pusdalops'), controller.create);

module.exports = router;
