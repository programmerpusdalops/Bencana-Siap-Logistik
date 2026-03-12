/**
 * Receiving (Penerimaan) Service
 * Create confirmation + update distribution status to completed.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const penerimaanIncludes = {
    distribusi: {
        include: {
            gudang: true,
            kendaraan: true,
            petugas: { select: { id: true, name: true } },
            permintaan: { include: { bencana: true } },
            detail: {
                include: {
                    barang: { include: { satuan: true } },
                },
            },
        },
    },
};

const getAll = async () => {
    return prisma.penerimaanLogistik.findMany({
        include: penerimaanIncludes,
        orderBy: { id: 'desc' },
    });
};

const getById = async (id) => {
    return prisma.penerimaanLogistik.findUnique({
        where: { id },
        include: penerimaanIncludes,
    });
};

const create = async (data, petugasPosko) => {
    return prisma.$transaction(async (tx) => {
        // 1. Create penerimaan record
        const penerimaan = await tx.penerimaanLogistik.create({
            data: {
                distribusi_id: parseInt(data.distribusi_id),
                petugas_posko: petugasPosko,
                catatan: data.catatan || null,
                dokumentasi: data.dokumentasi || null,
                latitude: data.latitude ? parseFloat(data.latitude) : null,
                longitude: data.longitude ? parseFloat(data.longitude) : null,
            },
            include: penerimaanIncludes,
        });

        // 2. Update distribution status to completed
        await tx.distribusi.update({
            where: { id: parseInt(data.distribusi_id) },
            data: { status: 'completed' },
        });

        // 3. Update permintaan status to completed
        const dist = await tx.distribusi.findUnique({ where: { id: parseInt(data.distribusi_id) } });
        if (dist) {
            await tx.permintaanLogistik.update({
                where: { id: dist.permintaan_id },
                data: { status: 'completed' },
            });
        }

        return penerimaan;
    });
};

module.exports = { getAll, getById, create };
