/**
 * Stock Service
 * CRUD operations for stok_logistik with relations.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const stockIncludes = {
    barang: {
        include: {
            jenis_logistik: true,
            satuan: true,
        },
    },
    gudang: true,
};

const getAllStocks = async () => {
    return prisma.stokLogistik.findMany({
        include: stockIncludes,
        orderBy: { id: 'asc' },
    });
};

const getStockById = async (id) => {
    return prisma.stokLogistik.findUnique({
        where: { id },
        include: stockIncludes,
    });
};

const createStock = async (data) => {
    return prisma.stokLogistik.create({
        data: {
            barang_id: parseInt(data.barang_id),
            gudang_id: parseInt(data.gudang_id),
            jumlah: parseInt(data.jumlah),
            expired_date: data.expired_date ? new Date(data.expired_date) : null,
            kondisi: data.kondisi || 'baik',
        },
        include: stockIncludes,
    });
};

const updateStock = async (id, data) => {
    const updateData = {};
    if (data.barang_id) updateData.barang_id = parseInt(data.barang_id);
    if (data.gudang_id) updateData.gudang_id = parseInt(data.gudang_id);
    if (data.jumlah !== undefined) updateData.jumlah = parseInt(data.jumlah);
    if (data.expired_date !== undefined) updateData.expired_date = data.expired_date ? new Date(data.expired_date) : null;
    if (data.kondisi) updateData.kondisi = data.kondisi;

    return prisma.stokLogistik.update({
        where: { id },
        data: updateData,
        include: stockIncludes,
    });
};

const deleteStock = async (id) => {
    return prisma.stokLogistik.delete({ where: { id } });
};

module.exports = {
    getAllStocks,
    getStockById,
    createStock,
    updateStock,
    deleteStock,
};
