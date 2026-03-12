/**
 * Receiving (Penerimaan) Controller
 * Supports multipart/form-data for image upload.
 */

const service = require('./receiving.service');

const getAll = async (req, res, next) => {
    try {
        const data = await service.getAll();
        res.json({ success: true, message: 'Receiving data retrieved', data });
    } catch (error) { next(error); }
};

const create = async (req, res, next) => {
    try {
        const { distribusi_id, catatan, latitude, longitude } = req.body;
        if (!distribusi_id) {
            return res.status(400).json({ success: false, message: 'distribusi_id wajib diisi' });
        }

        const payload = {
            distribusi_id,
            catatan: catatan || null,
            dokumentasi: req.file ? `/uploads/${req.file.filename}` : null,
            latitude: latitude || null,
            longitude: longitude || null,
        };

        const petugasName = req.user.name || 'Unknown';
        const data = await service.create(payload, petugasName);
        res.status(201).json({ success: true, message: 'Konfirmasi penerimaan berhasil', data });
    } catch (error) { next(error); }
};

module.exports = { getAll, create };
