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
    const instansi = await prisma.instansi.upsert({
        where: { id: 1 },
        update: {},
        create: {
            nama_instansi: 'BPBD Sulteng',
            jenis_instansi: 'Pemerintah',
        },
    });
    console.log('✅ Default instansi seeded');

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
            instansi_id: instansi.id,
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
