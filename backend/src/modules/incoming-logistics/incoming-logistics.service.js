/**
 * Incoming Logistics Service
 * CRUD operations for barang_masuk.
 * Business rule: after insert, stock (stok_logistik) must increase.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const barangMasukIncludes = {
    barang: {
        include: {
            jenis_logistik: true,
            satuan: true,
        },
    },
    gudang: true,
};

const getAllBarangMasuk = async () => {
    return prisma.barangMasuk.findMany({
        include: barangMasukIncludes,
        orderBy: { id: 'desc' },
    });
};

const getBarangMasukById = async (id) => {
    return prisma.barangMasuk.findUnique({
        where: { id },
        include: barangMasukIncludes,
    });
};

/**
 * Insert new barang masuk AND update stock in a single transaction.
 * If a stock row already exists for (barang_id, gudang_id), increment jumlah.
 * Otherwise create a new stock row.
 */
const createBarangMasuk = async (data) => {
    const barangId = parseInt(data.barang_id);
    const gudangId = parseInt(data.gudang_id);
    const jumlah = parseInt(data.jumlah);

    return prisma.$transaction(async (tx) => {
        // 1. Insert barang masuk record
        const barangMasuk = await tx.barangMasuk.create({
            data: {
                tanggal_masuk: new Date(data.tanggal_masuk),
                barang_id: barangId,
                jumlah,
                gudang_id: gudangId,
                sumber_logistik: data.sumber_logistik,
                supplier: data.supplier,
                catatan: data.catatan || null,
            },
            include: barangMasukIncludes,
        });

        // 2. Upsert stock: find existing row by barang_id + gudang_id, increment jumlah
        const existingStock = await tx.stokLogistik.findFirst({
            where: { barang_id: barangId, gudang_id: gudangId },
        });

        if (existingStock) {
            await tx.stokLogistik.update({
                where: { id: existingStock.id },
                data: { jumlah: existingStock.jumlah + jumlah },
            });
        } else {
            await tx.stokLogistik.create({
                data: {
                    barang_id: barangId,
                    gudang_id: gudangId,
                    jumlah,
                    kondisi: 'baik',
                },
            });
        }

        return barangMasuk;
    });
};

module.exports = {
    getAllBarangMasuk,
    getBarangMasukById,
    createBarangMasuk,
};
