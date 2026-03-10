/**
 * Database Seed Script
 * Creates initial roles and a default super admin user.
 *
 * Usage: node prisma/seed.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...\n');

    // ─── Seed Roles ─────────────────────────────────────────────────────────────
    const roles = [
        { name: 'super_admin' },
        { name: 'admin_gudang' },
        { name: 'admin_pusdalops' },
        { name: 'petugas_posko' },
        { name: 'pimpinan' },
    ];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: {},
            create: role,
        });
    }
    console.log('✅ Roles seeded');

    // ─── Seed Default Instansi ──────────────────────────────────────────────────
    const instansiList = [
        { id: 1, nama_instansi: 'BPBD Sulteng', jenis_instansi: 'Pemerintah' },
        { id: 2, nama_instansi: 'DINSOS', jenis_instansi: 'Pemerintah' },
        { id: 3, nama_instansi: 'DINAS PANGAN', jenis_instansi: 'Pemerintah' },
        { id: 4, nama_instansi: 'PMI', jenis_instansi: 'LSM/NGO' },
        { id: 5, nama_instansi: 'DONATUR', jenis_instansi: 'Swasta/Pribadi' },
    ];

    let defaultInstansi;
    for (const inst of instansiList) {
        const created = await prisma.instansi.upsert({
            where: { id: inst.id },
            update: {},
            create: inst,
        });
        if (inst.id === 1) defaultInstansi = created;
    }
    console.log('✅ Instansi data seeded');

    // ─── Seed Super Admin User ──────────────────────────────────────────────────
    const superAdminRole = await prisma.role.findUnique({
        where: { name: 'super_admin' },
    });

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.upsert({
        where: { email: 'admin@bpbd.go.id' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'admin@bpbd.go.id',
            password: hashedPassword,
            role_id: superAdminRole.id,
            instansi_id: defaultInstansi.id,
        },
    });
    console.log('✅ Super Admin user seeded');
    console.log('   Email    : admin@bpbd.go.id');
    console.log('   Password : admin123');

    // ─── Seed Satuan ────────────────────────────────────────────────────────────
    const satuanList = ['Kg', 'Pcs', 'Liter', 'Box', 'Karung', 'Paket'];
    for (const nama of satuanList) {
        await prisma.satuan.upsert({
            where: { id: satuanList.indexOf(nama) + 1 },
            update: {},
            create: { nama_satuan: nama },
        });
    }
    console.log('✅ Satuan seeded');

    // ─── Seed Jenis Logistik ────────────────────────────────────────────────────
    const jenisList = ['Pangan', 'Sandang', 'Peralatan', 'Medis'];
    for (const nama of jenisList) {
        await prisma.jenisLogistik.upsert({
            where: { id: jenisList.indexOf(nama) + 1 },
            update: {},
            create: { nama_jenis: nama },
        });
    }
    console.log('✅ Jenis Logistik seeded');

    // ─── Seed Barang Logistik ────────────────────────────────────────────────────
    const barangList = [
        { id: 1, nama_barang: 'Beras', jenis_logistik_id: 1, satuan_id: 1 },
        { id: 2, nama_barang: 'Mie Instan', jenis_logistik_id: 1, satuan_id: 4 },
        { id: 3, nama_barang: 'Air Mineral', jenis_logistik_id: 1, satuan_id: 4 },
        { id: 4, nama_barang: 'Selimut', jenis_logistik_id: 2, satuan_id: 2 },
        { id: 5, nama_barang: 'Obat P3K', jenis_logistik_id: 4, satuan_id: 6 },
        { id: 6, nama_barang: 'Masker', jenis_logistik_id: 4, satuan_id: 2 },
        { id: 7, nama_barang: 'Tenda Pengungsi', jenis_logistik_id: 3, satuan_id: 2 },
    ];
    for (const b of barangList) {
        await prisma.barangLogistik.upsert({
            where: { id: b.id },
            update: {},
            create: b,
        });
    }
    console.log('✅ Barang Logistik seeded');

    // ─── Seed Gudang ─────────────────────────────────────────────────────────────
    const gudangList = [
        { id: 1, nama_gudang: 'Gudang BPBD Pusat', instansi_id: 1, alamat: 'Jl. Raya No. 1, Palu' },
        { id: 2, nama_gudang: 'Gudang PMI', instansi_id: 4, alamat: 'Jl. PMI No. 5, Palu' },
        { id: 3, nama_gudang: 'Gudang Dinsos', instansi_id: 2, alamat: 'Jl. Sosial No. 10, Palu' },
    ];
    for (const g of gudangList) {
        await prisma.gudang.upsert({
            where: { id: g.id },
            update: {},
            create: g,
        });
    }
    console.log('✅ Gudang seeded');

    // ─── Seed Kendaraan ──────────────────────────────────────────────────────────
    const kendaraanList = [
        { id: 1, nama_kendaraan: 'Truk BPBD', nomor_polisi: 'B 1234 CD', kapasitas: '5 Ton' },
        { id: 2, nama_kendaraan: 'Truk Logistik', nomor_polisi: 'B 5678 EF', kapasitas: '3 Ton' },
        { id: 3, nama_kendaraan: 'Pickup Lapangan', nomor_polisi: 'D 9012 GH', kapasitas: '1 Ton' },
        { id: 4, nama_kendaraan: 'Ambulance', nomor_polisi: 'B 3456 IJ', kapasitas: '500 Kg' },
    ];
    for (const k of kendaraanList) {
        await prisma.kendaraan.upsert({
            where: { id: k.id },
            update: {},
            create: k,
        });
    }
    console.log('✅ Kendaraan seeded');

    // ─── Seed Stok Logistik ──────────────────────────────────────────────────────
    const stokList = [
        { id: 1, barang_id: 1, gudang_id: 1, jumlah: 500, expired_date: new Date('2026-12-01'), kondisi: 'baik' },
        { id: 2, barang_id: 2, gudang_id: 1, jumlah: 1200, expired_date: new Date('2026-06-15'), kondisi: 'baik' },
        { id: 3, barang_id: 3, gudang_id: 2, jumlah: 800, expired_date: new Date('2027-01-01'), kondisi: 'baik' },
        { id: 4, barang_id: 4, gudang_id: 3, jumlah: 50, kondisi: 'baik' },
        { id: 5, barang_id: 7, gudang_id: 1, jumlah: 30, kondisi: 'baik' },
        { id: 6, barang_id: 5, gudang_id: 2, jumlah: 200, expired_date: new Date('2025-03-01'), kondisi: 'expired' },
        { id: 7, barang_id: 6, gudang_id: 1, jumlah: 5000, expired_date: new Date('2027-06-01'), kondisi: 'baik' },
    ];
    for (const s of stokList) {
        await prisma.stokLogistik.upsert({
            where: { id: s.id },
            update: {},
            create: s,
        });
    }
    console.log('✅ Stok Logistik seeded');

    // ─── Reset auto-increment sequences ──────────────────────────────────────────
    const sequences = [
        { table: 'roles', col: 'id' },
        { table: 'instansi', col: 'id' },
        { table: 'satuan', col: 'id' },
        { table: 'jenis_logistik', col: 'id' },
        { table: 'barang_logistik', col: 'id' },
        { table: 'gudang', col: 'id' },
        { table: 'kendaraan', col: 'id' },
        { table: 'stok_logistik', col: 'id' },
    ];
    for (const s of sequences) {
        await prisma.$executeRawUnsafe(
            `SELECT setval(pg_get_serial_sequence('${s.table}', '${s.col}'), COALESCE(MAX(${s.col}), 1)) FROM ${s.table}`
        );
    }
    console.log('✅ Auto-increment sequences reset');

    console.log('\n🎉 Database seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
