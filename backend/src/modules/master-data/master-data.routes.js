/**
 * Master Data Routes
 * CRUD routes for: Jenis Logistik, Barang Logistik, Gudang, Instansi, Satuan, Kendaraan
 *
 * All routes protected: authenticate + requireRole('super_admin')
 */

const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../../middlewares/auth');
const {
    jenisLogistikController,
    barangLogistikController,
    gudangController,
    instansiController,
    satuanController,
    kendaraanController,
} = require('./master-data.controller');

// ─── Authentication ─────────────────────────────────────────────────────────────
router.use(authenticate);

// Helper middleware for write operations
const requireSuperAdmin = requireRole('super_admin');

// ─── Jenis Logistik ─────────────────────────────────────────────────────────────
router.get('/jenis-logistik', jenisLogistikController.getAll);
router.post('/jenis-logistik', requireSuperAdmin, jenisLogistikController.create);
router.get('/jenis-logistik/:id', jenisLogistikController.getById);
router.put('/jenis-logistik/:id', requireSuperAdmin, jenisLogistikController.update);
router.delete('/jenis-logistik/:id', requireSuperAdmin, jenisLogistikController.delete);

// ─── Barang Logistik ────────────────────────────────────────────────────────────
router.get('/barang', barangLogistikController.getAll);
router.post('/barang', requireSuperAdmin, barangLogistikController.create);
router.get('/barang/:id', barangLogistikController.getById);
router.put('/barang/:id', requireSuperAdmin, barangLogistikController.update);
router.delete('/barang/:id', requireSuperAdmin, barangLogistikController.delete);

// ─── Gudang ─────────────────────────────────────────────────────────────────────
router.get('/gudang', gudangController.getAll);
router.post('/gudang', requireSuperAdmin, gudangController.create);
router.get('/gudang/:id', gudangController.getById);
router.put('/gudang/:id', requireSuperAdmin, gudangController.update);
router.delete('/gudang/:id', requireSuperAdmin, gudangController.delete);

// ─── Instansi ───────────────────────────────────────────────────────────────────
router.get('/instansi', instansiController.getAll);
router.post('/instansi', requireSuperAdmin, instansiController.create);
router.get('/instansi/:id', instansiController.getById);
router.put('/instansi/:id', requireSuperAdmin, instansiController.update);
router.delete('/instansi/:id', requireSuperAdmin, instansiController.delete);

// ─── Satuan ─────────────────────────────────────────────────────────────────────
router.get('/satuan', satuanController.getAll);
router.post('/satuan', requireSuperAdmin, satuanController.create);
router.get('/satuan/:id', satuanController.getById);
router.put('/satuan/:id', requireSuperAdmin, satuanController.update);
router.delete('/satuan/:id', requireSuperAdmin, satuanController.delete);

// ─── Kendaraan ──────────────────────────────────────────────────────────────────
router.get('/kendaraan', kendaraanController.getAll);
router.post('/kendaraan', requireSuperAdmin, kendaraanController.create);
router.get('/kendaraan/:id', kendaraanController.getById);
router.put('/kendaraan/:id', requireSuperAdmin, kendaraanController.update);
router.delete('/kendaraan/:id', requireSuperAdmin, kendaraanController.delete);

module.exports = router;
