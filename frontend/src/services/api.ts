/**
 * API Service Layer
 * 
 * This file contains all API service functions.
 * Login now calls the real backend API.
 * Other endpoints still use dummy data (will be connected in future workflows).
 * 
 * Base URL: /api (proxied to backend via Vite)
 */

import {
  dashboardSummary, monthlyIncoming, distribusiWilayah, stokInstansi,
  stockData, barangMasukData, permintaanData, distribusiData,
  bencanaData, konfirmasiData, jenisLogistikData, barangLogistikData,
  gudangData, instansiData, kendaraanData, notificationsData
} from '@/data/dummyData';

// ─── Auth Headers Helper ────────────────────────────────────────────────────────
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// --- AUTH ---
// POST /api/auth/login → real backend call (handled by useAuth hook)
// Kept here for reference; actual login is done in useAuth.tsx

// --- DASHBOARD ---
// BACKEND API REQUIRED
export const getDashboardSummary = async () => dashboardSummary;
export const getMonthlyIncoming = async () => monthlyIncoming;
export const getDistribusiWilayah = async () => distribusiWilayah;
export const getStokInstansi = async () => stokInstansi;

// --- STOCK ---
export const getStocks = async () => stockData;

// --- BARANG MASUK ---
export const getBarangMasuk = async () => barangMasukData;
export const createBarangMasuk = async (data: unknown) => {
  console.log('Creating barang masuk:', data);
  return { id: Date.now(), ...data as object };
};

// --- PERMINTAAN ---
export const getPermintaan = async () => permintaanData;
export const createPermintaan = async (data: unknown) => {
  console.log('Creating permintaan:', data);
  return { id: Date.now(), ...data as object };
};

// --- DISTRIBUSI ---
export const getDistribusi = async () => distribusiData;
export const createDistribusi = async (data: unknown) => {
  console.log('Creating distribusi:', data);
  return { id: Date.now(), ...data as object };
};

// --- BENCANA ---
export const getBencana = async () => bencanaData;

// --- KONFIRMASI ---
export const getKonfirmasi = async () => konfirmasiData;
export const createKonfirmasi = async (data: unknown) => {
  console.log('Creating konfirmasi:', data);
  return { id: Date.now(), ...data as object };
};

// --- MASTER DATA ---
export const getJenisLogistik = async () => jenisLogistikData;
export const getBarangLogistik = async () => barangLogistikData;
export const getGudang = async () => gudangData;
export const getInstansi = async () => instansiData;
export const getKendaraan = async () => kendaraanData;

// --- NOTIFICATIONS ---
export const getNotifications = async () => notificationsData;
