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

// All routes require authentication + super_admin role
router.use(authenticate);
router.use(requireRole('super_admin'));

// ─── Jenis Logistik ─────────────────────────────────────────────────────────────
router.get('/jenis-logistik', jenisLogistikController.getAll);
router.post('/jenis-logistik', jenisLogistikController.create);
router.get('/jenis-logistik/:id', jenisLogistikController.getById);
router.put('/jenis-logistik/:id', jenisLogistikController.update);
router.delete('/jenis-logistik/:id', jenisLogistikController.delete);

// ─── Barang Logistik ────────────────────────────────────────────────────────────
router.get('/barang', barangLogistikController.getAll);
router.post('/barang', barangLogistikController.create);
router.get('/barang/:id', barangLogistikController.getById);
router.put('/barang/:id', barangLogistikController.update);
router.delete('/barang/:id', barangLogistikController.delete);

// ─── Gudang ─────────────────────────────────────────────────────────────────────
router.get('/gudang', gudangController.getAll);
router.post('/gudang', gudangController.create);
router.get('/gudang/:id', gudangController.getById);
router.put('/gudang/:id', gudangController.update);
router.delete('/gudang/:id', gudangController.delete);

// ─── Instansi ───────────────────────────────────────────────────────────────────
router.get('/instansi', instansiController.getAll);
router.post('/instansi', instansiController.create);
router.get('/instansi/:id', instansiController.getById);
router.put('/instansi/:id', instansiController.update);
router.delete('/instansi/:id', instansiController.delete);

// ─── Satuan ─────────────────────────────────────────────────────────────────────
router.get('/satuan', satuanController.getAll);
router.post('/satuan', satuanController.create);
router.get('/satuan/:id', satuanController.getById);
router.put('/satuan/:id', satuanController.update);
router.delete('/satuan/:id', satuanController.delete);

// ─── Kendaraan ──────────────────────────────────────────────────────────────────
router.get('/kendaraan', kendaraanController.getAll);
router.post('/kendaraan', kendaraanController.create);
router.get('/kendaraan/:id', kendaraanController.getById);
router.put('/kendaraan/:id', kendaraanController.update);
router.delete('/kendaraan/:id', kendaraanController.delete);

module.exports = router;
