/**
 * Stock Controller
 * Request/response handling for stock management.
 */

const stockService = require('./stocks.service');

const getAll = async (req, res, next) => {
    try {
        const data = await stockService.getAllStocks();
        res.json({ success: true, message: 'Stock data retrieved successfully', data });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const data = await stockService.getStockById(id);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Stock not found' });
        }
        res.json({ success: true, message: 'Stock retrieved successfully', data });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const { barang_id, gudang_id, jumlah } = req.body;
        if (!barang_id || !gudang_id || jumlah === undefined) {
            return res.status(400).json({ success: false, message: 'barang_id, gudang_id, dan jumlah wajib diisi' });
        }
        const data = await stockService.createStock(req.body);
        res.status(201).json({ success: true, message: 'Stock created successfully', data });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await stockService.getStockById(id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Stock not found' });
        }
        const data = await stockService.updateStock(id, req.body);
        res.json({ success: true, message: 'Stock updated successfully', data });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await stockService.getStockById(id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Stock not found' });
        }
        await stockService.deleteStock(id);
        res.json({ success: true, message: 'Stock deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, update, remove };
