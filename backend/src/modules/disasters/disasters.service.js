/**
 * Disasters (Bencana) Service
 * CRUD operations for bencana table.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = async () => {
    return prisma.bencana.findMany({
        orderBy: { tanggal: 'desc' },
    });
};

const getById = async (id) => {
    return prisma.bencana.findUnique({ where: { id } });
};

const create = async (data) => {
    return prisma.bencana.create({
        data: {
            jenis_bencana: data.jenis_bencana,
            lokasi: data.lokasi,
            latitude: data.latitude ? parseFloat(data.latitude) : null,
            longitude: data.longitude ? parseFloat(data.longitude) : null,
            tanggal: new Date(data.tanggal),
            jumlah_pengungsi: parseInt(data.jumlah_pengungsi) || 0,
            jumlah_korban: parseInt(data.jumlah_korban) || 0,
            status: data.status || 'Tanggap Darurat',
        },
    });
};

const update = async (id, data) => {
    const updateData = {};
    if (data.jenis_bencana) updateData.jenis_bencana = data.jenis_bencana;
    if (data.lokasi) updateData.lokasi = data.lokasi;
    if (data.latitude !== undefined) updateData.latitude = data.latitude ? parseFloat(data.latitude) : null;
    if (data.longitude !== undefined) updateData.longitude = data.longitude ? parseFloat(data.longitude) : null;
    if (data.tanggal) updateData.tanggal = new Date(data.tanggal);
    if (data.jumlah_pengungsi !== undefined) updateData.jumlah_pengungsi = parseInt(data.jumlah_pengungsi);
    if (data.jumlah_korban !== undefined) updateData.jumlah_korban = parseInt(data.jumlah_korban);
    if (data.status) updateData.status = data.status;

    return prisma.bencana.update({ where: { id }, data: updateData });
};

const remove = async (id) => {
    return prisma.bencana.delete({ where: { id } });
};

module.exports = { getAll, getById, create, update, remove };
