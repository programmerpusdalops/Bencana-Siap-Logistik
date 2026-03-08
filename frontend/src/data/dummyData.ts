import type {
  User, Stock, BarangMasuk, PermintaanLogistik, Distribusi,
  Bencana, DashboardSummary, ChartData, DistribusiWilayah,
  StokInstansi, JenisLogistik, BarangLogistik, Gudang,
  Instansi, Kendaraan, KonfirmasiPenerimaan, Notification
} from '@/types';

// --- USERS ---
export const dummyUsers: User[] = [
  { id: 1, name: 'Budi Santoso', email: 'budi@bpbd.go.id', role: 'super_admin' },
  { id: 2, name: 'Siti Rahayu', email: 'siti@bpbd.go.id', role: 'admin_gudang' },
  { id: 3, name: 'Ahmad Hidayat', email: 'ahmad@bpbd.go.id', role: 'admin_pusdalops' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi@bpbd.go.id', role: 'petugas_posko' },
  { id: 5, name: 'Ir. Hendra Wijaya', email: 'hendra@bpbd.go.id', role: 'pimpinan' },
];

export const currentUser: User = dummyUsers[0];

// --- DASHBOARD ---
export const dashboardSummary: DashboardSummary = {
  totalStock: 12500,
  totalIncoming: 5800,
  totalDistributed: 4300,
  disasterEvents: 12,
};

export const monthlyIncoming: ChartData[] = [
  { month: 'Jan', value: 500 },
  { month: 'Feb', value: 800 },
  { month: 'Mar', value: 700 },
  { month: 'Apr', value: 950 },
  { month: 'Mei', value: 600 },
  { month: 'Jun', value: 1100 },
  { month: 'Jul', value: 850 },
  { month: 'Agu', value: 720 },
  { month: 'Sep', value: 930 },
  { month: 'Okt', value: 680 },
  { month: 'Nov', value: 1050 },
  { month: 'Des', value: 440 },
];

export const distribusiWilayah: DistribusiWilayah[] = [
  { wilayah: 'Palu', value: 1200 },
  { wilayah: 'Donggala', value: 800 },
  { wilayah: 'Sigi', value: 650 },
  { wilayah: 'Parigi', value: 450 },
  { wilayah: 'Banggai', value: 300 },
];

export const stokInstansi: StokInstansi[] = [
  { instansi: 'BPBD', value: 4500 },
  { instansi: 'PMI', value: 3200 },
  { instansi: 'Dinsos', value: 2800 },
  { instansi: 'BNPB', value: 2000 },
];

// --- STOCK ---
export const stockData: Stock[] = [
  { id: 1, namaBarang: 'Beras', jenis: 'Pangan', gudang: 'Gudang BPBD Pusat', jumlah: 500, satuan: 'Kg', expired: '2026-12-01', kondisi: 'Baik', status: 'Normal' },
  { id: 2, namaBarang: 'Mie Instan', jenis: 'Pangan', gudang: 'Gudang BPBD Pusat', jumlah: 1200, satuan: 'Dus', expired: '2026-06-15', kondisi: 'Baik', status: 'Normal' },
  { id: 3, namaBarang: 'Air Mineral', jenis: 'Pangan', gudang: 'Gudang PMI', jumlah: 800, satuan: 'Dus', expired: '2027-01-01', kondisi: 'Baik', status: 'Normal' },
  { id: 4, namaBarang: 'Selimut', jenis: 'Sandang', gudang: 'Gudang Dinsos', jumlah: 50, satuan: 'Pcs', expired: '-', kondisi: 'Baik', status: 'Low' },
  { id: 5, namaBarang: 'Tenda Pengungsi', jenis: 'Shelter', gudang: 'Gudang BPBD Pusat', jumlah: 30, satuan: 'Unit', expired: '-', kondisi: 'Baik', status: 'Low' },
  { id: 6, namaBarang: 'Obat P3K', jenis: 'Kesehatan', gudang: 'Gudang PMI', jumlah: 200, satuan: 'Set', expired: '2025-03-01', kondisi: 'Expired', status: 'Expired' },
  { id: 7, namaBarang: 'Masker', jenis: 'Kesehatan', gudang: 'Gudang BPBD Pusat', jumlah: 5000, satuan: 'Pcs', expired: '2027-06-01', kondisi: 'Baik', status: 'Normal' },
  { id: 8, namaBarang: 'Sarung', jenis: 'Sandang', gudang: 'Gudang Dinsos', jumlah: 300, satuan: 'Pcs', expired: '-', kondisi: 'Baik', status: 'Normal' },
  { id: 9, namaBarang: 'Genset', jenis: 'Peralatan', gudang: 'Gudang BPBD Pusat', jumlah: 10, satuan: 'Unit', expired: '-', kondisi: 'Baik', status: 'Low' },
  { id: 10, namaBarang: 'Perahu Karet', jenis: 'Peralatan', gudang: 'Gudang BNPB', jumlah: 5, satuan: 'Unit', expired: '-', kondisi: 'Baik', status: 'Low' },
];

// --- BARANG MASUK ---
export const barangMasukData: BarangMasuk[] = [
  { id: 1, tanggal: '2026-01-15', gudang: 'Gudang BPBD Pusat', barang: 'Beras', jenis: 'Pangan', jumlah: 200, satuan: 'Kg', expired: '2026-12-01', sumber: 'Donasi', supplier: 'PT Sumber Pangan', catatan: 'Donasi dari perusahaan' },
  { id: 2, tanggal: '2026-01-20', gudang: 'Gudang PMI', barang: 'Air Mineral', jenis: 'Pangan', jumlah: 500, satuan: 'Dus', expired: '2027-01-01', sumber: 'Pembelian', supplier: 'CV Aqua Sejahtera', catatan: 'Pengadaan rutin' },
  { id: 3, tanggal: '2026-02-05', gudang: 'Gudang Dinsos', barang: 'Selimut', jenis: 'Sandang', jumlah: 100, satuan: 'Pcs', expired: '-', sumber: 'Bantuan Pemerintah', supplier: 'Kemensos RI', catatan: 'Bantuan dari pusat' },
];

// --- PERMINTAAN LOGISTIK ---
export const permintaanData: PermintaanLogistik[] = [
  { id: 1, nomorPermintaan: 'REQ-2026-001', lokasiBencana: 'Palu, Sulawesi Tengah', jenisBencana: 'Gempa Bumi', tanggalKejadian: '2026-01-10', jumlahKorban: 15, jumlahPengungsi: 350, items: [{ barang: 'Beras', jumlah: 100 }, { barang: 'Air Mineral', jumlah: 200 }], status: 'Pending', tanggalPermintaan: '2026-01-10' },
  { id: 2, nomorPermintaan: 'REQ-2026-002', lokasiBencana: 'Donggala, Sulawesi Tengah', jenisBencana: 'Banjir', tanggalKejadian: '2026-01-25', jumlahKorban: 5, jumlahPengungsi: 120, items: [{ barang: 'Selimut', jumlah: 50 }, { barang: 'Tenda Pengungsi', jumlah: 5 }], status: 'Approved', tanggalPermintaan: '2026-01-25' },
  { id: 3, nomorPermintaan: 'REQ-2026-003', lokasiBencana: 'Sigi, Sulawesi Tengah', jenisBencana: 'Tanah Longsor', tanggalKejadian: '2026-02-12', jumlahKorban: 8, jumlahPengungsi: 200, items: [{ barang: 'Obat P3K', jumlah: 30 }, { barang: 'Masker', jumlah: 500 }], status: 'Rejected', tanggalPermintaan: '2026-02-12' },
  { id: 4, nomorPermintaan: 'REQ-2026-004', lokasiBencana: 'Parigi Moutong', jenisBencana: 'Banjir', tanggalKejadian: '2026-03-01', jumlahKorban: 3, jumlahPengungsi: 80, items: [{ barang: 'Beras', jumlah: 50 }, { barang: 'Mie Instan', jumlah: 100 }], status: 'Pending', tanggalPermintaan: '2026-03-01' },
];

// --- DISTRIBUSI ---
export const distribusiData: Distribusi[] = [
  { id: 1, nomorDistribusi: 'DIST-2026-001', gudangAsal: 'Gudang BPBD Pusat', tujuan: 'Posko Palu', tanggalKirim: '2026-01-12', kendaraan: 'Truk B 1234 CD', driver: 'Suparjo', petugas: 'Ahmad Hidayat', items: [{ barang: 'Beras', jumlah: 100 }, { barang: 'Air Mineral', jumlah: 200 }], status: 'Diterima' },
  { id: 2, nomorDistribusi: 'DIST-2026-002', gudangAsal: 'Gudang Dinsos', tujuan: 'Posko Donggala', tanggalKirim: '2026-01-28', kendaraan: 'Truk B 5678 EF', driver: 'Bambang', petugas: 'Dewi Lestari', items: [{ barang: 'Selimut', jumlah: 50 }, { barang: 'Tenda Pengungsi', jumlah: 5 }], status: 'Dikirim' },
  { id: 3, nomorDistribusi: 'DIST-2026-003', gudangAsal: 'Gudang BPBD Pusat', tujuan: 'Posko Sigi', tanggalKirim: '2026-02-15', kendaraan: 'Pickup D 9012 GH', driver: 'Rahmat', petugas: 'Siti Rahayu', items: [{ barang: 'Masker', jumlah: 500 }], status: 'Pending' },
];

// --- BENCANA ---
export const bencanaData: Bencana[] = [
  { id: 1, lokasi: 'Palu', jenis: 'Gempa Bumi', lat: -0.8917, lng: 119.8707, tanggal: '2026-01-10', korban: 15, pengungsi: 350, status: 'Tanggap Darurat' },
  { id: 2, lokasi: 'Donggala', jenis: 'Banjir', lat: -0.6714, lng: 119.7414, tanggal: '2026-01-25', korban: 5, pengungsi: 120, status: 'Tanggap Darurat' },
  { id: 3, lokasi: 'Sigi', jenis: 'Tanah Longsor', lat: -1.3211, lng: 119.9703, tanggal: '2026-02-12', korban: 8, pengungsi: 200, status: 'Pemulihan' },
  { id: 4, lokasi: 'Parigi Moutong', jenis: 'Banjir', lat: -0.3769, lng: 120.1787, tanggal: '2026-03-01', korban: 3, pengungsi: 80, status: 'Tanggap Darurat' },
  { id: 5, lokasi: 'Banggai', jenis: 'Gempa Bumi', lat: -1.5795, lng: 122.7894, tanggal: '2026-02-20', korban: 2, pengungsi: 45, status: 'Pemulihan' },
];

// --- KONFIRMASI PENERIMAAN ---
export const konfirmasiData: KonfirmasiPenerimaan[] = [
  { id: 1, nomorDistribusi: 'DIST-2026-001', barangDiterima: 'Beras', jumlahDiterima: 98, catatan: '2 kg rusak saat perjalanan', tanggalTerima: '2026-01-13' },
];

// --- MASTER DATA ---
export const jenisLogistikData: JenisLogistik[] = [
  { id: 1, nama: 'Pangan', keterangan: 'Kebutuhan makanan dan minuman' },
  { id: 2, nama: 'Sandang', keterangan: 'Pakaian dan perlengkapan' },
  { id: 3, nama: 'Kesehatan', keterangan: 'Obat-obatan dan alat kesehatan' },
  { id: 4, nama: 'Shelter', keterangan: 'Tempat tinggal sementara' },
  { id: 5, nama: 'Peralatan', keterangan: 'Peralatan pendukung' },
];

export const barangLogistikData: BarangLogistik[] = [
  { id: 1, nama: 'Beras', jenis: 'Pangan', satuan: 'Kg' },
  { id: 2, nama: 'Mie Instan', jenis: 'Pangan', satuan: 'Dus' },
  { id: 3, nama: 'Air Mineral', jenis: 'Pangan', satuan: 'Dus' },
  { id: 4, nama: 'Selimut', jenis: 'Sandang', satuan: 'Pcs' },
  { id: 5, nama: 'Tenda Pengungsi', jenis: 'Shelter', satuan: 'Unit' },
  { id: 6, nama: 'Obat P3K', jenis: 'Kesehatan', satuan: 'Set' },
  { id: 7, nama: 'Masker', jenis: 'Kesehatan', satuan: 'Pcs' },
];

export const gudangData: Gudang[] = [
  { id: 1, nama: 'Gudang BPBD Pusat', alamat: 'Jl. Raya No. 1, Palu', kapasitas: 5000, penanggungJawab: 'Siti Rahayu' },
  { id: 2, nama: 'Gudang PMI', alamat: 'Jl. PMI No. 5, Palu', kapasitas: 3000, penanggungJawab: 'Andi Susanto' },
  { id: 3, nama: 'Gudang Dinsos', alamat: 'Jl. Sosial No. 10, Palu', kapasitas: 2000, penanggungJawab: 'Rina Wati' },
  { id: 4, nama: 'Gudang BNPB', alamat: 'Jl. Nasional No. 3, Jakarta', kapasitas: 10000, penanggungJawab: 'Dr. Bambang' },
];

export const instansiData: Instansi[] = [
  { id: 1, nama: 'BPBD Sulteng', alamat: 'Palu, Sulawesi Tengah', kontak: '0451-123456' },
  { id: 2, nama: 'PMI Cabang Palu', alamat: 'Palu, Sulawesi Tengah', kontak: '0451-234567' },
  { id: 3, nama: 'Dinas Sosial Sulteng', alamat: 'Palu, Sulawesi Tengah', kontak: '0451-345678' },
  { id: 4, nama: 'BNPB', alamat: 'Jakarta', kontak: '021-456789' },
];

export const kendaraanData: Kendaraan[] = [
  { id: 1, nomorPolisi: 'B 1234 CD', jenis: 'Truk', kapasitas: '5 Ton', status: 'Tersedia' },
  { id: 2, nomorPolisi: 'B 5678 EF', jenis: 'Truk', kapasitas: '3 Ton', status: 'Digunakan' },
  { id: 3, nomorPolisi: 'D 9012 GH', jenis: 'Pickup', kapasitas: '1 Ton', status: 'Tersedia' },
  { id: 4, nomorPolisi: 'B 3456 IJ', jenis: 'Ambulance', kapasitas: '500 Kg', status: 'Maintenance' },
];

// --- NOTIFICATIONS ---
export const notificationsData: Notification[] = [
  { id: 1, title: 'Permintaan Baru', message: 'Permintaan logistik dari Posko Palu menunggu verifikasi', time: '5 menit lalu', read: false, type: 'warning' },
  { id: 2, title: 'Stok Rendah', message: 'Stok Selimut di Gudang Dinsos hampir habis', time: '1 jam lalu', read: false, type: 'error' },
  { id: 3, title: 'Distribusi Terkirim', message: 'DIST-2026-002 telah dikirim ke Posko Donggala', time: '3 jam lalu', read: true, type: 'success' },
  { id: 4, title: 'Barang Masuk', message: '500 dus Air Mineral diterima di Gudang PMI', time: '1 hari lalu', read: true, type: 'info' },
];
