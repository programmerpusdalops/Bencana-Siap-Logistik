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
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/master', masterRoutes);
router.use('/stocks', stocksRoutes);

module.exports = router;
