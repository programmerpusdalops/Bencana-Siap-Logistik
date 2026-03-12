-- CreateTable
CREATE TABLE "barang_masuk" (
    "id" SERIAL NOT NULL,
    "tanggal_masuk" TIMESTAMP(3) NOT NULL,
    "barang_id" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "gudang_id" INTEGER NOT NULL,
    "sumber_logistik" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barang_masuk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "barang_masuk_barang_id_idx" ON "barang_masuk"("barang_id");

-- CreateIndex
CREATE INDEX "barang_masuk_gudang_id_idx" ON "barang_masuk"("gudang_id");

-- AddForeignKey
ALTER TABLE "barang_masuk" ADD CONSTRAINT "barang_masuk_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "barang_logistik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barang_masuk" ADD CONSTRAINT "barang_masuk_gudang_id_fkey" FOREIGN KEY ("gudang_id") REFERENCES "gudang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
