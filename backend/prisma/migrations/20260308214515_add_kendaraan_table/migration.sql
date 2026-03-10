-- CreateTable
CREATE TABLE "kendaraan" (
    "id" SERIAL NOT NULL,
    "nama_kendaraan" TEXT NOT NULL,
    "nomor_polisi" TEXT NOT NULL,
    "kapasitas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kendaraan_pkey" PRIMARY KEY ("id")
);
