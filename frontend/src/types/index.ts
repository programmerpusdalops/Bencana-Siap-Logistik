export type UserRole = 'super_admin' | 'admin_gudang' | 'admin_pusdalops' | 'petugas_posko' | 'pimpinan';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Stock {
  id: number;
  namaBarang: string;
  jenis: string;
  gudang: string;
  jumlah: number;
  satuan: string;
  expired: string;
  kondisi: string;
  status: 'Normal' | 'Low' | 'Expired';
}

export interface BarangMasuk {
  id: number;
  tanggal: string;
  gudang: string;
  barang: string;
  jenis: string;
  jumlah: number;
  satuan: string;
  expired: string;
  sumber: string;
  supplier: string;
  catatan: string;
}

export interface PermintaanItem {
  barang: string;
  jumlah: number;
}

export interface PermintaanLogistik {
  id: number;
  nomorPermintaan: string;
  lokasiBencana: string;
  jenisBencana: string;
  tanggalKejadian: string;
  jumlahKorban: number;
  jumlahPengungsi: number;
  items: PermintaanItem[];
  status: 'Pending' | 'Approved' | 'Rejected';
  tanggalPermintaan: string;
}

export interface DistribusiItem {
  barang: string;
  jumlah: number;
}

export interface Distribusi {
  id: number;
  nomorDistribusi: string;
  gudangAsal: string;
  tujuan: string;
  tanggalKirim: string;
  kendaraan: string;
  driver: string;
  petugas: string;
  items: DistribusiItem[];
  status: 'Pending' | 'Dikirim' | 'Diterima';
}

export interface Bencana {
  id: number;
  lokasi: string;
  jenis: string;
  lat: number;
  lng: number;
  tanggal: string;
  korban: number;
  pengungsi: number;
  status: string;
}

export interface DashboardSummary {
  totalStock: number;
  totalIncoming: number;
  totalDistributed: number;
  disasterEvents: number;
}

export interface ChartData {
  month: string;
  value: number;
}

export interface DistribusiWilayah {
  wilayah: string;
  value: number;
}

export interface StokInstansi {
  instansi: string;
  value: number;
}

// Master Data Types
export interface JenisLogistik {
  id: number;
  nama: string;
  keterangan: string;
}

export interface BarangLogistik {
  id: number;
  nama: string;
  jenis: string;
  satuan: string;
}

export interface Gudang {
  id: number;
  nama: string;
  alamat: string;
  kapasitas: number;
  penanggungJawab: string;
}

export interface Instansi {
  id: number;
  nama: string;
  alamat: string;
  kontak: string;
}

export interface Kendaraan {
  id: number;
  nomorPolisi: string;
  jenis: string;
  kapasitas: string;
  status: string;
}

export interface KonfirmasiPenerimaan {
  id: number;
  nomorDistribusi: string;
  barangDiterima: string;
  jumlahDiterima: number;
  foto?: string;
  catatan: string;
  tanggalTerima: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}
