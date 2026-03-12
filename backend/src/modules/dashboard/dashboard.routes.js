const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const controller = require('./dashboard.controller');

router.use(authenticate);

router.get('/summary', controller.getSummary);
router.get('/monthly-incoming', controller.getMonthlyIncoming);
router.get('/distribusi-wilayah', controller.getDistribusiWilayah);
router.get('/stok-instansi', controller.getStokInstansi);

module.exports = router;
