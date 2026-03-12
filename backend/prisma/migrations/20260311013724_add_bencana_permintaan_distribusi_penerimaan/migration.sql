-- CreateTable
CREATE TABLE "bencana" (
    "id" SERIAL NOT NULL,
    "jenis_bencana" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jumlah_pengungsi" INTEGER NOT NULL DEFAULT 0,
    "jumlah_korban" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Tanggap Darurat',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bencana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permintaan_logistik" (
    "id" SERIAL NOT NULL,
    "bencana_id" INTEGER NOT NULL,
    "pemohon_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "tanggal" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permintaan_logistik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permintaan_detail" (
    "id" SERIAL NOT NULL,
    "permintaan_id" INTEGER NOT NULL,
    "barang_id" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permintaan_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distribusi" (
    "id" SERIAL NOT NULL,
    "permintaan_id" INTEGER NOT NULL,
    "gudang_id" INTEGER NOT NULL,
    "tanggal_kirim" TIMESTAMP(3) NOT NULL,
    "kendaraan_id" INTEGER NOT NULL,
    "petugas_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distribusi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distribusi_detail" (
    "id" SERIAL NOT NULL,
    "distribusi_id" INTEGER NOT NULL,
    "barang_id" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distribusi_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penerimaan_logistik" (
    "id" SERIAL NOT NULL,
    "distribusi_id" INTEGER NOT NULL,
    "tanggal_terima" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "petugas_posko" TEXT NOT NULL,
    "catatan" TEXT,
    "dokumentasi" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penerimaan_logistik_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bencana_tanggal_idx" ON "bencana"("tanggal");

-- CreateIndex
CREATE INDEX "permintaan_logistik_status_idx" ON "permintaan_logistik"("status");

-- AddForeignKey
ALTER TABLE "permintaan_logistik" ADD CONSTRAINT "permintaan_logistik_bencana_id_fkey" FOREIGN KEY ("bencana_id") REFERENCES "bencana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permintaan_logistik" ADD CONSTRAINT "permintaan_logistik_pemohon_id_fkey" FOREIGN KEY ("pemohon_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permintaan_detail" ADD CONSTRAINT "permintaan_detail_permintaan_id_fkey" FOREIGN KEY ("permintaan_id") REFERENCES "permintaan_logistik"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permintaan_detail" ADD CONSTRAINT "permintaan_detail_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "barang_logistik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribusi" ADD CONSTRAINT "distribusi_permintaan_id_fkey" FOREIGN KEY ("permintaan_id") REFERENCES "permintaan_logistik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribusi" ADD CONSTRAINT "distribusi_gudang_id_fkey" FOREIGN KEY ("gudang_id") REFERENCES "gudang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribusi" ADD CONSTRAINT "distribusi_kendaraan_id_fkey" FOREIGN KEY ("kendaraan_id") REFERENCES "kendaraan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribusi" ADD CONSTRAINT "distribusi_petugas_id_fkey" FOREIGN KEY ("petugas_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribusi_detail" ADD CONSTRAINT "distribusi_detail_distribusi_id_fkey" FOREIGN KEY ("distribusi_id") REFERENCES "distribusi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribusi_detail" ADD CONSTRAINT "distribusi_detail_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "barang_logistik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penerimaan_logistik" ADD CONSTRAINT "penerimaan_logistik_distribusi_id_fkey" FOREIGN KEY ("distribusi_id") REFERENCES "distribusi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
