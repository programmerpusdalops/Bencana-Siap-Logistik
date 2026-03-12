/**
 * Permintaan (Logistics Requests) Controller
 */

const service = require('./requests.service');

const getAll = async (req, res, next) => {
    try {
        const data = await service.getAll();
        res.json({ success: true, message: 'Requests retrieved successfully', data });
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
        const { bencana_id, items } = req.body;
        if (!bencana_id || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'bencana_id dan items wajib diisi' });
        }
        const data = await service.create(req.body, req.user.id);
        res.status(201).json({ success: true, message: 'Permintaan berhasil dibuat', data });
    } catch (error) { next(error); }
};

const approve = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await service.getById(id);
        if (!existing) return res.status(404).json({ success: false, message: 'Data not found' });
        if (existing.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Hanya permintaan pending yang bisa disetujui' });
        }
        const data = await service.approve(id);
        res.json({ success: true, message: 'Permintaan disetujui', data });
    } catch (error) { next(error); }
};

const reject = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await service.getById(id);
        if (!existing) return res.status(404).json({ success: false, message: 'Data not found' });
        if (existing.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Hanya permintaan pending yang bisa ditolak' });
        }
        const data = await service.reject(id);
        res.json({ success: true, message: 'Permintaan ditolak', data });
    } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, approve, reject };
