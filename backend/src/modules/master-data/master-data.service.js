/**
 * Master Data Service
 * CRUD operations for: JenisLogistik, BarangLogistik, Gudang, Instansi, Satuan, Kendaraan
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════════════════════════
// JENIS LOGISTIK
// ═══════════════════════════════════════════════════════════════════════════════

const getAllJenisLogistik = async () => {
    return prisma.jenisLogistik.findMany({ orderBy: { id: 'asc' } });
};

const getJenisLogistikById = async (id) => {
    return prisma.jenisLogistik.findUnique({ where: { id } });
};

const createJenisLogistik = async (data) => {
    return prisma.jenisLogistik.create({ data: { nama_jenis: data.nama_jenis } });
};

const updateJenisLogistik = async (id, data) => {
    return prisma.jenisLogistik.update({ where: { id }, data: { nama_jenis: data.nama_jenis } });
};

const deleteJenisLogistik = async (id) => {
    return prisma.jenisLogistik.delete({ where: { id } });
};

// ═══════════════════════════════════════════════════════════════════════════════
// BARANG LOGISTIK
// ═══════════════════════════════════════════════════════════════════════════════

const getAllBarangLogistik = async () => {
    return prisma.barangLogistik.findMany({
        include: {
            jenis_logistik: true,
            satuan: true,
        },
        orderBy: { id: 'asc' },
    });
};

const getBarangLogistikById = async (id) => {
    return prisma.barangLogistik.findUnique({
        where: { id },
        include: { jenis_logistik: true, satuan: true },
    });
};

const createBarangLogistik = async (data) => {
    return prisma.barangLogistik.create({
        data: {
            nama_barang: data.nama_barang,
            jenis_logistik_id: parseInt(data.jenis_logistik_id),
            satuan_id: parseInt(data.satuan_id),
        },
        include: { jenis_logistik: true, satuan: true },
    });
};

const updateBarangLogistik = async (id, data) => {
    const updateData = {};
    if (data.nama_barang) updateData.nama_barang = data.nama_barang;
    if (data.jenis_logistik_id) updateData.jenis_logistik_id = parseInt(data.jenis_logistik_id);
    if (data.satuan_id) updateData.satuan_id = parseInt(data.satuan_id);

    return prisma.barangLogistik.update({
        where: { id },
        data: updateData,
        include: { jenis_logistik: true, satuan: true },
    });
};

const deleteBarangLogistik = async (id) => {
    return prisma.barangLogistik.delete({ where: { id } });
};

// ═══════════════════════════════════════════════════════════════════════════════
// GUDANG
// ═══════════════════════════════════════════════════════════════════════════════

const getAllGudang = async () => {
    return prisma.gudang.findMany({
        include: { instansi: true },
        orderBy: { id: 'asc' },
    });
};

const getGudangById = async (id) => {
    return prisma.gudang.findUnique({
        where: { id },
        include: { instansi: true },
    });
};

const createGudang = async (data) => {
    return prisma.gudang.create({
        data: {
            nama_gudang: data.nama_gudang,
            instansi_id: parseInt(data.instansi_id),
            alamat: data.alamat || null,
        },
        include: { instansi: true },
    });
};

const updateGudang = async (id, data) => {
    const updateData = {};
    if (data.nama_gudang) updateData.nama_gudang = data.nama_gudang;
    if (data.instansi_id) updateData.instansi_id = parseInt(data.instansi_id);
    if (data.alamat !== undefined) updateData.alamat = data.alamat;

    return prisma.gudang.update({
        where: { id },
        data: updateData,
        include: { instansi: true },
    });
};

const deleteGudang = async (id) => {
    return prisma.gudang.delete({ where: { id } });
};

// ═══════════════════════════════════════════════════════════════════════════════
// INSTANSI
// ═══════════════════════════════════════════════════════════════════════════════

const getAllInstansi = async () => {
    return prisma.instansi.findMany({ orderBy: { id: 'asc' } });
};

const getInstansiById = async (id) => {
    return prisma.instansi.findUnique({ where: { id } });
};

const createInstansi = async (data) => {
    return prisma.instansi.create({
        data: {
            nama_instansi: data.nama_instansi,
            jenis_instansi: data.jenis_instansi || '',
        },
    });
};

const updateInstansi = async (id, data) => {
    const updateData = {};
    if (data.nama_instansi) updateData.nama_instansi = data.nama_instansi;
    if (data.jenis_instansi !== undefined) updateData.jenis_instansi = data.jenis_instansi;

    return prisma.instansi.update({ where: { id }, data: updateData });
};

const deleteInstansi = async (id) => {
    return prisma.instansi.delete({ where: { id } });
};

// ═══════════════════════════════════════════════════════════════════════════════
// SATUAN
// ═══════════════════════════════════════════════════════════════════════════════

const getAllSatuan = async () => {
    return prisma.satuan.findMany({ orderBy: { id: 'asc' } });
};

const getSatuanById = async (id) => {
    return prisma.satuan.findUnique({ where: { id } });
};

const createSatuan = async (data) => {
    return prisma.satuan.create({ data: { nama_satuan: data.nama_satuan } });
};

const updateSatuan = async (id, data) => {
    return prisma.satuan.update({ where: { id }, data: { nama_satuan: data.nama_satuan } });
};

const deleteSatuan = async (id) => {
    return prisma.satuan.delete({ where: { id } });
};

// ═══════════════════════════════════════════════════════════════════════════════
// KENDARAAN
// ═══════════════════════════════════════════════════════════════════════════════

const getAllKendaraan = async () => {
    return prisma.kendaraan.findMany({ orderBy: { id: 'asc' } });
};

const getKendaraanById = async (id) => {
    return prisma.kendaraan.findUnique({ where: { id } });
};

const createKendaraan = async (data) => {
    return prisma.kendaraan.create({
        data: {
            nama_kendaraan: data.nama_kendaraan,
            nomor_polisi: data.nomor_polisi,
            kapasitas: data.kapasitas || null,
        },
    });
};

const updateKendaraan = async (id, data) => {
    const updateData = {};
    if (data.nama_kendaraan) updateData.nama_kendaraan = data.nama_kendaraan;
    if (data.nomor_polisi) updateData.nomor_polisi = data.nomor_polisi;
    if (data.kapasitas !== undefined) updateData.kapasitas = data.kapasitas;

    return prisma.kendaraan.update({ where: { id }, data: updateData });
};

const deleteKendaraan = async (id) => {
    return prisma.kendaraan.delete({ where: { id } });
};

module.exports = {
    // Jenis Logistik
    getAllJenisLogistik, getJenisLogistikById, createJenisLogistik, updateJenisLogistik, deleteJenisLogistik,
    // Barang Logistik
    getAllBarangLogistik, getBarangLogistikById, createBarangLogistik, updateBarangLogistik, deleteBarangLogistik,
    // Gudang
    getAllGudang, getGudangById, createGudang, updateGudang, deleteGudang,
    // Instansi
    getAllInstansi, getInstansiById, createInstansi, updateInstansi, deleteInstansi,
    // Satuan
    getAllSatuan, getSatuanById, createSatuan, updateSatuan, deleteSatuan,
    // Kendaraan
    getAllKendaraan, getKendaraanById, createKendaraan, updateKendaraan, deleteKendaraan,
};
