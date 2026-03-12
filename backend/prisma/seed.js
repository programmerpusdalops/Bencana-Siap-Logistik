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

    // ─── Seed Additional Users ──────────────────────────────────────────────────
    const additionalUsers = [
        {
            name: 'Admin Gudang',
            email: 'gudang@gmail.go.id',
            password: 'gudang123',
            roleName: 'admin_gudang',
        },
        {
            name: 'Admin Pusdalops',
            email: 'dalops@gmail.go.id',
            password: 'dalops123',
            roleName: 'admin_pusdalops',
        },
        {
            name: 'Petugas Posko',
            email: 'posko@gmail.go.id',
            password: 'posko123',
            roleName: 'petugas_posko',
        },
        {
            name: 'Pimpinan',
            email: 'pimpinan@gmail.go.id',
            password: 'pimpinan123',
            roleName: 'pimpinan',
        },
    ];

    for (const u of additionalUsers) {
        const role = await prisma.role.findUnique({
            where: { name: u.roleName },
        });

        const hashed = await bcrypt.hash(u.password, 10);

        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                name: u.name,
                email: u.email,
                password: hashed,
                role_id: role.id,
                instansi_id: defaultInstansi.id,
            },
        });
        console.log(`✅ User seeded: ${u.name} (${u.email})`);
    }

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

    // ─── Seed Barang Masuk ──────────────────────────────────────────────────────
    const barangMasukList = [
        {
            id: 1,
            tanggal_masuk: new Date('2026-01-15'),
            barang_id: 1,
            jumlah: 200,
            gudang_id: 1,
            sumber_logistik: 'Donasi',
            supplier: 'PT Sumber Pangan',
            catatan: 'Donasi dari perusahaan',
        },
        {
            id: 2,
            tanggal_masuk: new Date('2026-01-20'),
            barang_id: 3,
            jumlah: 500,
            gudang_id: 2,
            sumber_logistik: 'Pembelian',
            supplier: 'CV Aqua Sejahtera',
            catatan: 'Pengadaan rutin',
        },
        {
            id: 3,
            tanggal_masuk: new Date('2026-02-05'),
            barang_id: 4,
            jumlah: 100,
            gudang_id: 3,
            sumber_logistik: 'Bantuan Pemerintah',
            supplier: 'Kemensos RI',
            catatan: 'Bantuan dari pusat',
        },
    ];
    for (const bm of barangMasukList) {
        await prisma.barangMasuk.upsert({
            where: { id: bm.id },
            update: {},
            create: bm,
        });
    }
    console.log('✅ Barang Masuk seeded');

    // ─── Seed Bencana ───────────────────────────────────────────────────────────
    const bencanaList = [
        { id: 1, jenis_bencana: 'Gempa Bumi', lokasi: 'Palu', latitude: -0.8917, longitude: 119.8707, tanggal: new Date('2026-01-10'), jumlah_pengungsi: 350, jumlah_korban: 15, status: 'Tanggap Darurat' },
        { id: 2, jenis_bencana: 'Banjir', lokasi: 'Donggala', latitude: -0.6714, longitude: 119.7414, tanggal: new Date('2026-01-25'), jumlah_pengungsi: 120, jumlah_korban: 5, status: 'Tanggap Darurat' },
        { id: 3, jenis_bencana: 'Tanah Longsor', lokasi: 'Sigi', latitude: -1.3211, longitude: 119.9703, tanggal: new Date('2026-02-12'), jumlah_pengungsi: 200, jumlah_korban: 8, status: 'Pemulihan' },
        { id: 4, jenis_bencana: 'Banjir', lokasi: 'Parigi Moutong', latitude: -0.3769, longitude: 120.1787, tanggal: new Date('2026-03-01'), jumlah_pengungsi: 80, jumlah_korban: 3, status: 'Tanggap Darurat' },
        { id: 5, jenis_bencana: 'Gempa Bumi', lokasi: 'Banggai', latitude: -1.5795, longitude: 122.7894, tanggal: new Date('2026-02-20'), jumlah_pengungsi: 45, jumlah_korban: 2, status: 'Pemulihan' },
    ];
    for (const b of bencanaList) {
        await prisma.bencana.upsert({
            where: { id: b.id },
            update: {},
            create: b,
        });
    }
    console.log('✅ Bencana seeded');

    // ─── Seed Permintaan Logistik ───────────────────────────────────────────────
    // Get pemohon user (petugas_posko)
    const pemohon = await prisma.user.findFirst({ where: { email: 'posko@gmail.go.id' } });
    const pemohonId = pemohon ? pemohon.id : 1;

    const permintaanList = [
        {
            id: 1,
            bencana_id: 1,
            pemohon_id: pemohonId,
            status: 'approved',
            tanggal: new Date('2026-01-10'),
        },
        {
            id: 2,
            bencana_id: 2,
            pemohon_id: pemohonId,
            status: 'pending',
            tanggal: new Date('2026-01-25'),
        },
        {
            id: 3,
            bencana_id: 3,
            pemohon_id: pemohonId,
            status: 'rejected',
            tanggal: new Date('2026-02-12'),
        },
        {
            id: 4,
            bencana_id: 4,
            pemohon_id: pemohonId,
            status: 'pending',
            tanggal: new Date('2026-03-01'),
        },
    ];

    for (const p of permintaanList) {
        await prisma.permintaanLogistik.upsert({
            where: { id: p.id },
            update: {},
            create: p,
        });
    }

    // Seed permintaan detail
    const permintaanDetailList = [
        { id: 1, permintaan_id: 1, barang_id: 1, jumlah: 100 },
        { id: 2, permintaan_id: 1, barang_id: 3, jumlah: 200 },
        { id: 3, permintaan_id: 2, barang_id: 4, jumlah: 50 },
        { id: 4, permintaan_id: 2, barang_id: 7, jumlah: 5 },
        { id: 5, permintaan_id: 3, barang_id: 5, jumlah: 30 },
        { id: 6, permintaan_id: 3, barang_id: 6, jumlah: 500 },
        { id: 7, permintaan_id: 4, barang_id: 1, jumlah: 50 },
        { id: 8, permintaan_id: 4, barang_id: 2, jumlah: 100 },
    ];

    for (const pd of permintaanDetailList) {
        await prisma.permintaanDetail.upsert({
            where: { id: pd.id },
            update: {},
            create: pd,
        });
    }
    console.log('✅ Permintaan Logistik seeded');

    // ─── Seed Distribusi ────────────────────────────────────────────────────────
    const adminUser = await prisma.user.findFirst({ where: { email: 'admin@bpbd.go.id' } });
    const petugasId = adminUser ? adminUser.id : 1;

    const distribusiList = [
        {
            id: 1,
            permintaan_id: 1,
            gudang_id: 1,
            tanggal_kirim: new Date('2026-01-12'),
            kendaraan_id: 1,
            petugas_id: petugasId,
            status: 'delivered',
        },
    ];
    for (const d of distribusiList) {
        await prisma.distribusi.upsert({
            where: { id: d.id },
            update: {},
            create: d,
        });
    }

    const distribusiDetailList = [
        { id: 1, distribusi_id: 1, barang_id: 1, jumlah: 100 },
        { id: 2, distribusi_id: 1, barang_id: 3, jumlah: 200 },
    ];
    for (const dd of distribusiDetailList) {
        await prisma.distribusiDetail.upsert({
            where: { id: dd.id },
            update: {},
            create: dd,
        });
    }
    console.log('✅ Distribusi seeded');

    // ─── Seed Penerimaan Logistik (dengan koordinat GPS) ────────────────────────
    const penerimaanList = [
        {
            id: 1,
            distribusi_id: 1,
            petugas_posko: 'Petugas Posko',
            catatan: 'Logistik diterima dalam kondisi baik, semua item sesuai manifest.',
            dokumentasi: null,
            latitude: -0.8917,
            longitude: 119.8707,
        },
    ];
    for (const p of penerimaanList) {
        await prisma.penerimaanLogistik.upsert({
            where: { id: p.id },
            update: {},
            create: p,
        });
    }
    console.log('✅ Penerimaan Logistik seeded');

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
        { table: 'barang_masuk', col: 'id' },
        { table: 'bencana', col: 'id' },
        { table: 'permintaan_logistik', col: 'id' },
        { table: 'permintaan_detail', col: 'id' },
        { table: 'distribusi', col: 'id' },
        { table: 'distribusi_detail', col: 'id' },
        { table: 'penerimaan_logistik', col: 'id' },
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

