-- CreateTable
CREATE TABLE "stok_logistik" (
    "id" SERIAL NOT NULL,
    "barang_id" INTEGER NOT NULL,
    "gudang_id" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL DEFAULT 0,
    "expired_date" TIMESTAMP(3),
    "kondisi" TEXT NOT NULL DEFAULT 'baik',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stok_logistik_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stok_logistik_barang_id_idx" ON "stok_logistik"("barang_id");

-- CreateIndex
CREATE INDEX "stok_logistik_gudang_id_idx" ON "stok_logistik"("gudang_id");

-- AddForeignKey
ALTER TABLE "stok_logistik" ADD CONSTRAINT "stok_logistik_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "barang_logistik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stok_logistik" ADD CONSTRAINT "stok_logistik_gudang_id_fkey" FOREIGN KEY ("gudang_id") REFERENCES "gudang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
