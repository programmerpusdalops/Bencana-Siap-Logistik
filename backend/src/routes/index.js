const express = require('express');
const router = express.Router();

// Health check
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'SIAP LOGISTIK BENCANA API is running',
        data: {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
        },
    });
});

// ─── Module Routes ──────────────────────────────────────────────────────────────
const authRoutes = require('../modules/auth/auth.routes');
const usersRoutes = require('../modules/users/users.routes');
const masterRoutes = require('../modules/master-data/master-data.routes');
const stocksRoutes = require('../modules/stocks/stocks.routes');
const barangMasukRoutes = require('../modules/incoming-logistics/incoming-logistics.routes');
const bencanaRoutes = require('../modules/disasters/disasters.routes');
const permintaanRoutes = require('../modules/requests/requests.routes');
const distribusiRoutes = require('../modules/distributions/distributions.routes');
const penerimaanRoutes = require('../modules/receiving/receiving.routes');
const dashboardRoutes = require('../modules/dashboard/dashboard.routes');

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/master', masterRoutes);
router.use('/stocks', stocksRoutes);
router.use('/barang-masuk', barangMasukRoutes);
router.use('/bencana', bencanaRoutes);
router.use('/permintaan', permintaanRoutes);
router.use('/distribusi', distribusiRoutes);
router.use('/penerimaan', penerimaanRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
