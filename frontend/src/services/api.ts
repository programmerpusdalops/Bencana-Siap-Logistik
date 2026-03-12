/**
 * API Service Layer
 *
 * All API calls go through this file.
 * Every endpoint now calls the real backend API.
 *
 * Base URL: /api (proxied to backend via Vite)
 */

// ─── Auth Headers Helper ────────────────────────────────────────────────────────
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ─── Global Fetch Wrapper ───────────────────────────────────────────────────────
export const fetchWithAuth = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    headers: getAuthHeaders(),
    ...options,
  });

  if (res.status === 401) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
  }

  return res;
};

const apiFetch = async (url: string, options?: RequestInit) => {
  const res = await fetchWithAuth(url, options);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'API Error');
  return json.data;
};

// --- DASHBOARD ---
export const getDashboardSummary = () => apiFetch('/api/dashboard/summary');
export const getMonthlyIncoming = () => apiFetch('/api/dashboard/monthly-incoming');
export const getDistribusiWilayah = () => apiFetch('/api/dashboard/distribusi-wilayah');
export const getStokInstansi = () => apiFetch('/api/dashboard/stok-instansi');

// --- STOCK ---
export const getStocks = () => apiFetch('/api/stocks');

// --- BARANG MASUK ---
export const getBarangMasuk = () => apiFetch('/api/barang-masuk');
export const createBarangMasuk = async (data: unknown) => {
  const res = await fetchWithAuth('/api/barang-masuk', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

// --- BENCANA ---
export const getBencana = () => apiFetch('/api/bencana');
export const createBencana = async (data: unknown) => {
  const res = await fetchWithAuth('/api/bencana', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

// --- PERMINTAAN ---
export const getPermintaan = () => apiFetch('/api/permintaan');
export const createPermintaan = async (data: unknown) => {
  const res = await fetchWithAuth('/api/permintaan', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};
export const approvePermintaan = async (id: number) => {
  const res = await fetchWithAuth(`/api/permintaan/${id}/approve`, {
    method: 'PATCH',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};
export const rejectPermintaan = async (id: number) => {
  const res = await fetchWithAuth(`/api/permintaan/${id}/reject`, {
    method: 'PATCH',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

// --- DISTRIBUSI ---
export const getDistribusi = () => apiFetch('/api/distribusi');
export const createDistribusi = async (data: unknown) => {
  const res = await fetchWithAuth('/api/distribusi', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

// --- PENERIMAAN (KONFIRMASI) ---
export const getPenerimaan = () => apiFetch('/api/penerimaan');
export const createPenerimaan = async (formData: FormData) => {
  const token = localStorage.getItem('auth_token');
  const res = await fetch('/api/penerimaan', {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (res.status === 401) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
  }
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

// --- MASTER DATA ---
export const getJenisLogistik = () => apiFetch('/api/master/jenis-logistik');
export const getBarangLogistik = () => apiFetch('/api/master/barang');
export const getGudang = () => apiFetch('/api/master/gudang');
export const getInstansi = () => apiFetch('/api/master/instansi');
export const getKendaraan = () => apiFetch('/api/master/kendaraan');
