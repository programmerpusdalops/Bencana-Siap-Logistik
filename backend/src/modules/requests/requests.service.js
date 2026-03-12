/**
 * Permintaan (Logistics Requests) Service
 * CRUD + approve/reject operations.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const permintaanIncludes = {
    bencana: true,
    pemohon: { select: { id: true, name: true, email: true } },
    detail: {
        include: {
            barang: {
                include: { jenis_logistik: true, satuan: true },
            },
        },
    },
};

const getAll = async () => {
    return prisma.permintaanLogistik.findMany({
        include: permintaanIncludes,
        orderBy: { id: 'desc' },
    });
};

const getById = async (id) => {
    return prisma.permintaanLogistik.findUnique({
        where: { id },
        include: permintaanIncludes,
    });
};

const create = async (data, pemohonId) => {
    return prisma.$transaction(async (tx) => {
        const permintaan = await tx.permintaanLogistik.create({
            data: {
                bencana_id: parseInt(data.bencana_id),
                pemohon_id: pemohonId,
                tanggal: new Date(),
                status: 'pending',
                detail: {
                    create: data.items.map((item) => ({
                        barang_id: parseInt(item.barang_id),
                        jumlah: parseInt(item.jumlah),
                    })),
                },
            },
            include: permintaanIncludes,
        });
        return permintaan;
    });
};

const approve = async (id) => {
    return prisma.permintaanLogistik.update({
        where: { id },
        data: { status: 'approved' },
        include: permintaanIncludes,
    });
};

const reject = async (id) => {
    return prisma.permintaanLogistik.update({
        where: { id },
        data: { status: 'rejected' },
        include: permintaanIncludes,
    });
};

module.exports = { getAll, getById, create, approve, reject };
