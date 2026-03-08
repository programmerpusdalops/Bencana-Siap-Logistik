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
router.use('/auth', authRoutes);

module.exports = router;
