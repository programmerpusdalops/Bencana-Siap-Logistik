/**
 * Dashboard Service
 * Aggregation queries for analytics.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSummary = async () => {
    const [totalStock, totalIncoming, totalDistribution, totalDisasters] = await Promise.all([
        prisma.stokLogistik.aggregate({ _sum: { jumlah: true } }),
        prisma.barangMasuk.aggregate({ _sum: { jumlah: true } }),
        prisma.distribusiDetail.aggregate({ _sum: { jumlah: true } }),
        prisma.bencana.count(),
    ]);

    return {
        total_stock: totalStock._sum.jumlah || 0,
        total_incoming: totalIncoming._sum.jumlah || 0,
        total_distribution: totalDistribution._sum.jumlah || 0,
        total_disasters: totalDisasters,
    };
};

const getMonthlyIncoming = async () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const currentYear = new Date().getFullYear();

    const result = [];
    for (let i = 0; i < 12; i++) {
        const startDate = new Date(currentYear, i, 1);
        const endDate = new Date(currentYear, i + 1, 1);
        const agg = await prisma.barangMasuk.aggregate({
            _sum: { jumlah: true },
            where: {
                tanggal_masuk: { gte: startDate, lt: endDate },
            },
        });
        result.push({ month: months[i], value: agg._sum.jumlah || 0 });
    }
    return result;
};

const getDistribusiWilayah = async () => {
    // Group distributions by bencana location
    const distribusi = await prisma.distribusi.findMany({
        include: {
            permintaan: { include: { bencana: true } },
            detail: true,
        },
    });

    const wilayahMap = {};
    for (const d of distribusi) {
        const lokasi = d.permintaan?.bencana?.lokasi || 'Lainnya';
        const totalJumlah = d.detail.reduce((sum, item) => sum + item.jumlah, 0);
        wilayahMap[lokasi] = (wilayahMap[lokasi] || 0) + totalJumlah;
    }

    return Object.entries(wilayahMap)
        .map(([wilayah, value]) => ({ wilayah, value }))
        .sort((a, b) => b.value - a.value);
};

const getStokInstansi = async () => {
    const stok = await prisma.stokLogistik.findMany({
        include: {
            gudang: { include: { instansi: true } },
        },
    });

    const instansiMap = {};
    for (const s of stok) {
        const instansi = s.gudang?.instansi?.nama_instansi || 'Lainnya';
        instansiMap[instansi] = (instansiMap[instansi] || 0) + s.jumlah;
    }

    return Object.entries(instansiMap)
        .map(([instansi, value]) => ({ instansi, value }))
        .sort((a, b) => b.value - a.value);
};

module.exports = { getSummary, getMonthlyIncoming, getDistribusiWilayah, getStokInstansi };
