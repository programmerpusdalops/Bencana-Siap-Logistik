/**
 * Distribution Service
 * CRUD operations + stock reduction on create.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const distribusiIncludes = {
    permintaan: {
        include: {
            bencana: true,
        },
    },
    gudang: true,
    kendaraan: true,
    petugas: { select: { id: true, name: true } },
    detail: {
        include: {
            barang: {
                include: { jenis_logistik: true, satuan: true },
            },
        },
    },
    penerimaan: true,
};

const getAll = async () => {
    return prisma.distribusi.findMany({
        include: distribusiIncludes,
        orderBy: { id: 'desc' },
    });
};

const getById = async (id) => {
    return prisma.distribusi.findUnique({
        where: { id },
        include: distribusiIncludes,
    });
};

/**
 * Create distribution AND reduce stock in a single transaction.
 */
const create = async (data) => {
    return prisma.$transaction(async (tx) => {
        // 1. Create distribution with detail items
        const distribusi = await tx.distribusi.create({
            data: {
                permintaan_id: parseInt(data.permintaan_id),
                gudang_id: parseInt(data.gudang_id),
                tanggal_kirim: new Date(data.tanggal_kirim),
                kendaraan_id: parseInt(data.kendaraan_id),
                petugas_id: parseInt(data.petugas_id),
                status: 'pending',
                detail: {
                    create: data.items.map((item) => ({
                        barang_id: parseInt(item.barang_id),
                        jumlah: parseInt(item.jumlah),
                    })),
                },
            },
            include: distribusiIncludes,
        });

        // 2. Reduce stock for each item
        for (const item of data.items) {
            const barangId = parseInt(item.barang_id);
            const gudangId = parseInt(data.gudang_id);
            const jumlah = parseInt(item.jumlah);

            const existingStock = await tx.stokLogistik.findFirst({
                where: { barang_id: barangId, gudang_id: gudangId },
            });

            if (!existingStock || existingStock.jumlah < jumlah) {
                throw new Error(`Stok tidak mencukupi untuk barang ID ${barangId}`);
            }

            await tx.stokLogistik.update({
                where: { id: existingStock.id },
                data: { jumlah: existingStock.jumlah - jumlah },
            });
        }

        // 3. Update permintaan status to processed
        await tx.permintaanLogistik.update({
            where: { id: parseInt(data.permintaan_id) },
            data: { status: 'processed' },
        });

        return distribusi;
    });
};

module.exports = { getAll, getById, create };
