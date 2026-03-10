/**
 * Master Data Controller
 * Request/response handling for all master data entities.
 */

const service = require('./master-data.service');

// ═══════════════════════════════════════════════════════════════════════════════
// Generic CRUD factory — DRY approach for all simple entities
// ═══════════════════════════════════════════════════════════════════════════════

const makeController = (entityName, { getAll, getById, create, update, remove }) => ({
    getAll: async (req, res, next) => {
        try {
            const data = await getAll();
            res.json({ success: true, message: `${entityName} retrieved successfully`, data });
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const data = await getById(id);
            if (!data) {
                return res.status(404).json({ success: false, message: `${entityName} not found` });
            }
            res.json({ success: true, message: `${entityName} retrieved successfully`, data });
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const data = await create(req.body);
            res.status(201).json({ success: true, message: `${entityName} created successfully`, data });
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            // Check existence
            const existing = await getById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: `${entityName} not found` });
            }
            const data = await update(id, req.body);
            res.json({ success: true, message: `${entityName} updated successfully`, data });
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const existing = await getById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: `${entityName} not found` });
            }
            await remove(id);
            res.json({ success: true, message: `${entityName} deleted successfully` });
        } catch (error) {
            // Handle FK constraint errors
            if (error.code === 'P2003') {
                return res.status(400).json({
                    success: false,
                    message: `Tidak dapat menghapus ${entityName} karena masih digunakan oleh data lain`,
                });
            }
            next(error);
        }
    },
});

// ─── Create controllers for each entity ──────────────────────────────────────

const jenisLogistikController = makeController('Jenis Logistik', {
    getAll: service.getAllJenisLogistik,
    getById: service.getJenisLogistikById,
    create: service.createJenisLogistik,
    update: service.updateJenisLogistik,
    remove: service.deleteJenisLogistik,
});

const barangLogistikController = makeController('Barang Logistik', {
    getAll: service.getAllBarangLogistik,
    getById: service.getBarangLogistikById,
    create: service.createBarangLogistik,
    update: service.updateBarangLogistik,
    remove: service.deleteBarangLogistik,
});

const gudangController = makeController('Gudang', {
    getAll: service.getAllGudang,
    getById: service.getGudangById,
    create: service.createGudang,
    update: service.updateGudang,
    remove: service.deleteGudang,
});

const instansiController = makeController('Instansi', {
    getAll: service.getAllInstansi,
    getById: service.getInstansiById,
    create: service.createInstansi,
    update: service.updateInstansi,
    remove: service.deleteInstansi,
});

const satuanController = makeController('Satuan', {
    getAll: service.getAllSatuan,
    getById: service.getSatuanById,
    create: service.createSatuan,
    update: service.updateSatuan,
    remove: service.deleteSatuan,
});

const kendaraanController = makeController('Kendaraan', {
    getAll: service.getAllKendaraan,
    getById: service.getKendaraanById,
    create: service.createKendaraan,
    update: service.updateKendaraan,
    remove: service.deleteKendaraan,
});

module.exports = {
    jenisLogistikController,
    barangLogistikController,
    gudangController,
    instansiController,
    satuanController,
    kendaraanController,
};
