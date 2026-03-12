/**
 * Distribution Controller
 */

const service = require('./distributions.service');

const getAll = async (req, res, next) => {
    try {
        const data = await service.getAll();
        res.json({ success: true, message: 'Distribution data retrieved', data });
    } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
    try {
        const data = await service.getById(parseInt(req.params.id));
        if (!data) return res.status(404).json({ success: false, message: 'Data not found' });
        res.json({ success: true, data });
    } catch (error) { next(error); }
};

const create = async (req, res, next) => {
    try {
        const { permintaan_id, gudang_id, tanggal_kirim, kendaraan_id, petugas_id, items } = req.body;
        if (!permintaan_id || !gudang_id || !tanggal_kirim || !kendaraan_id || !petugas_id || !items?.length) {
            return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
        }
        const data = await service.create(req.body);
        res.status(201).json({ success: true, message: 'Distribusi berhasil dibuat, stok berkurang', data });
    } catch (error) {
        if (error.message?.includes('Stok tidak mencukupi')) {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
};

module.exports = { getAll, getById, create };
