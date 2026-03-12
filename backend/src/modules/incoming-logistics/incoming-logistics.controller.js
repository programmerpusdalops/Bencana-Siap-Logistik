/**
 * Incoming Logistics Controller
 * Request/response handling for barang masuk.
 */

const incomingService = require('./incoming-logistics.service');

const getAll = async (req, res, next) => {
    try {
        const data = await incomingService.getAllBarangMasuk();
        res.json({ success: true, message: 'Barang masuk data retrieved successfully', data });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const data = await incomingService.getBarangMasukById(id);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Barang masuk not found' });
        }
        res.json({ success: true, message: 'Barang masuk retrieved successfully', data });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const { tanggal_masuk, barang_id, jumlah, gudang_id, sumber_logistik, supplier } = req.body;

        if (!tanggal_masuk || !barang_id || !jumlah || !gudang_id || !sumber_logistik || !supplier) {
            return res.status(400).json({
                success: false,
                message: 'tanggal_masuk, barang_id, jumlah, gudang_id, sumber_logistik, dan supplier wajib diisi',
            });
        }

        const data = await incomingService.createBarangMasuk(req.body);
        res.status(201).json({ success: true, message: 'Barang masuk recorded successfully. Stock updated.', data });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create };
