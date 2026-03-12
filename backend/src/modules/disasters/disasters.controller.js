/**
 * Disasters (Bencana) Controller
 */

const service = require('./disasters.service');

const getAll = async (req, res, next) => {
    try {
        const data = await service.getAll();
        res.json({ success: true, message: 'Disaster data retrieved successfully', data });
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
        const { jenis_bencana, lokasi, tanggal } = req.body;
        if (!jenis_bencana || !lokasi || !tanggal) {
            return res.status(400).json({ success: false, message: 'jenis_bencana, lokasi, dan tanggal wajib diisi' });
        }
        const data = await service.create(req.body);
        res.status(201).json({ success: true, message: 'Disaster event created', data });
    } catch (error) { next(error); }
};

const update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await service.getById(id);
        if (!existing) return res.status(404).json({ success: false, message: 'Data not found' });
        const data = await service.update(id, req.body);
        res.json({ success: true, message: 'Disaster event updated', data });
    } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await service.getById(id);
        if (!existing) return res.status(404).json({ success: false, message: 'Data not found' });
        await service.remove(id);
        res.json({ success: true, message: 'Disaster event deleted' });
    } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };
