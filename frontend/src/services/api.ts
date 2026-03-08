/**
 * API Service Layer
 * 
 * This file contains all API service functions.
 * Currently returns dummy data for frontend development.
 * 
 * BACKEND API REQUIRED:
 * Base URL: /api
 * Auth: Bearer token in Authorization header
 */

import {
  dashboardSummary, monthlyIncoming, distribusiWilayah, stokInstansi,
  stockData, barangMasukData, permintaanData, distribusiData,
  bencanaData, konfirmasiData, jenisLogistikData, barangLogistikData,
  gudangData, instansiData, kendaraanData, notificationsData, dummyUsers, currentUser
} from '@/data/dummyData';

// --- AUTH ---
// BACKEND API REQUIRED
// POST /api/auth/login - { email, password } => { token, user }
// POST /api/auth/logout
// GET  /api/auth/me => User
export const login = async (_email: string, _password: string) => {
  return { token: 'dummy-token', user: currentUser };
};
export const getCurrentUser = async () => currentUser;
export const getUsers = async () => dummyUsers;

// --- DASHBOARD ---
// BACKEND API REQUIRED
// GET /api/dashboard/summary => DashboardSummary
// GET /api/dashboard/monthly-incoming => ChartData[]
// GET /api/dashboard/distribusi-wilayah => DistribusiWilayah[]
// GET /api/dashboard/stok-instansi => StokInstansi[]
export const getDashboardSummary = async () => dashboardSummary;
export const getMonthlyIncoming = async () => monthlyIncoming;
export const getDistribusiWilayah = async () => distribusiWilayah;
export const getStokInstansi = async () => stokInstansi;

// --- STOCK ---
// BACKEND API REQUIRED
// GET    /api/stocks?search=&filter=&page=&limit=&sort= => { data: Stock[], total: number }
// POST   /api/stocks - Stock => Stock
// PUT    /api/stocks/:id - Stock => Stock
// DELETE /api/stocks/:id => void
export const getStocks = async () => stockData;

// --- BARANG MASUK ---
// BACKEND API REQUIRED
// GET  /api/barang-masuk => BarangMasuk[]
// POST /api/barang-masuk - BarangMasuk => BarangMasuk
export const getBarangMasuk = async () => barangMasukData;
export const createBarangMasuk = async (data: unknown) => {
  console.log('Creating barang masuk:', data);
  return { id: Date.now(), ...data as object };
};

// --- PERMINTAAN ---
// BACKEND API REQUIRED
// GET    /api/permintaan => PermintaanLogistik[]
// POST   /api/permintaan - PermintaanLogistik => PermintaanLogistik
// PUT    /api/permintaan/:id/approve => void
// PUT    /api/permintaan/:id/reject => void
export const getPermintaan = async () => permintaanData;
export const createPermintaan = async (data: unknown) => {
  console.log('Creating permintaan:', data);
  return { id: Date.now(), ...data as object };
};

// --- DISTRIBUSI ---
// BACKEND API REQUIRED
// GET  /api/distribusi => Distribusi[]
// POST /api/distribusi - Distribusi => Distribusi
export const getDistribusi = async () => distribusiData;
export const createDistribusi = async (data: unknown) => {
  console.log('Creating distribusi:', data);
  return { id: Date.now(), ...data as object };
};

// --- BENCANA ---
// BACKEND API REQUIRED
// GET /api/bencana => Bencana[]
export const getBencana = async () => bencanaData;

// --- KONFIRMASI ---
// BACKEND API REQUIRED
// GET  /api/konfirmasi => KonfirmasiPenerimaan[]
// POST /api/konfirmasi - KonfirmasiPenerimaan => KonfirmasiPenerimaan
export const getKonfirmasi = async () => konfirmasiData;
export const createKonfirmasi = async (data: unknown) => {
  console.log('Creating konfirmasi:', data);
  return { id: Date.now(), ...data as object };
};

// --- MASTER DATA ---
// BACKEND API REQUIRED
// CRUD /api/master/jenis-logistik
// CRUD /api/master/barang-logistik
// CRUD /api/master/gudang
// CRUD /api/master/instansi
// CRUD /api/master/kendaraan
export const getJenisLogistik = async () => jenisLogistikData;
export const getBarangLogistik = async () => barangLogistikData;
export const getGudang = async () => gudangData;
export const getInstansi = async () => instansiData;
export const getKendaraan = async () => kendaraanData;

// --- NOTIFICATIONS ---
// BACKEND API REQUIRED
// GET /api/notifications => Notification[]
// PUT /api/notifications/:id/read => void
export const getNotifications = async () => notificationsData;
