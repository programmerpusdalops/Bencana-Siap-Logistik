/**
 * Dashboard Controller
 */

const service = require('./dashboard.service');

const getSummary = async (req, res, next) => {
    try {
        const data = await service.getSummary();
        res.json({ success: true, data });
    } catch (error) { next(error); }
};

const getMonthlyIncoming = async (req, res, next) => {
    try {
        const data = await service.getMonthlyIncoming();
        res.json({ success: true, data });
    } catch (error) { next(error); }
};

const getDistribusiWilayah = async (req, res, next) => {
    try {
        const data = await service.getDistribusiWilayah();
        res.json({ success: true, data });
    } catch (error) { next(error); }
};

const getStokInstansi = async (req, res, next) => {
    try {
        const data = await service.getStokInstansi();
        res.json({ success: true, data });
    } catch (error) { next(error); }
};

module.exports = { getSummary, getMonthlyIncoming, getDistribusiWilayah, getStokInstansi };
