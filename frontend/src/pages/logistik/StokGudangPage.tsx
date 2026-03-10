/**
 * StokGudangPage — Warehouse Stock Management
 * Fetches real data from /api/stocks, supports search, filter, sort, pagination, and CRUD.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { getAuthHeaders } from '@/services/api';
import { Package, Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';

const PAGE_SIZE = 10;

interface StockItem {
  id: number;
  barang_id: number;
  gudang_id: number;
  jumlah: number;
  expired_date: string | null;
  kondisi: string;
  barang: {
    nama_barang: string;
    jenis_logistik: { nama_jenis: string };
    satuan: { nama_satuan: string };
  };
  gudang: { nama_gudang: string };
}

const StokGudangPage = () => {
  // Data state
  const [data, setData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('all');
  const [filterKondisi, setFilterKondisi] = useState('all');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('namaBarang');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<StockItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StockItem | null>(null);
  const [formData, setFormData] = useState({ barang_id: '', gudang_id: '', jumlah: '', expired_date: '', kondisi: 'baik' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Dropdown options
  const [barangOptions, setBarangOptions] = useState<any[]>([]);
  const [gudangOptions, setGudangOptions] = useState<any[]>([]);

  // ─── Fetch stock data ───────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stocks', { headers: getAuthHeaders() });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Fetch dropdown options ─────────────────────────────────────────────────
  const fetchOptions = useCallback(async () => {
    try {
      const [barangRes, gudangRes] = await Promise.all([
        fetch('/api/master/barang', { headers: getAuthHeaders() }),
        fetch('/api/master/gudang', { headers: getAuthHeaders() }),
      ]);
      const barangJson = await barangRes.json();
      const gudangJson = await gudangRes.json();
      if (barangJson.success) setBarangOptions(barangJson.data);
      if (gudangJson.success) setGudangOptions(gudangJson.data);
    } catch (err) {
      console.error('Dropdown fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, [fetchData, fetchOptions]);

  // ─── Derived jenis list for filter ──────────────────────────────────────────
  const jenisList = useMemo(() => {
    const set = new Set(data.map(d => d.barang.jenis_logistik.nama_jenis));
    return Array.from(set).sort();
  }, [data]);

  // ─── Filter, sort, paginate ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...data];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(d =>
        d.barang.nama_barang.toLowerCase().includes(s) ||
        d.gudang.nama_gudang.toLowerCase().includes(s)
      );
    }
    if (filterJenis !== 'all') {
      result = result.filter(d => d.barang.jenis_logistik.nama_jenis === filterJenis);
    }
    if (filterKondisi !== 'all') {
      result = result.filter(d => d.kondisi === filterKondisi);
    }

    result.sort((a, b) => {
      let av: any, bv: any;
      switch (sortKey) {
        case 'namaBarang': av = a.barang.nama_barang; bv = b.barang.nama_barang; break;
        case 'jenis': av = a.barang.jenis_logistik.nama_jenis; bv = b.barang.jenis_logistik.nama_jenis; break;
        case 'gudang': av = a.gudang.nama_gudang; bv = b.gudang.nama_gudang; break;
        case 'jumlah': av = a.jumlah; bv = b.jumlah; break;
        case 'kondisi': av = a.kondisi; bv = b.kondisi; break;
        default: av = a.barang.nama_barang; bv = b.barang.nama_barang;
      }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === 'asc' ? av - bv : bv - av;
    });

    return result;
  }, [data, search, filterJenis, filterKondisi, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };
  const SortIcon = ({ col }: { col: string }) => (
    <span className="ml-1 text-xs">{sortKey === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span>
  );

  // ─── Modal handlers ─────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setFormError('');
    setFormData({ barang_id: '', gudang_id: '', jumlah: '', expired_date: '', kondisi: 'baik' });
    setShowModal(true);
  };

  const openEdit = (item: StockItem) => {
    setEditing(item);
    setFormError('');
    setFormData({
      barang_id: String(item.barang_id),
      gudang_id: String(item.gudang_id),
      jumlah: String(item.jumlah),
      expired_date: item.expired_date ? item.expired_date.split('T')[0] : '',
      kondisi: item.kondisi,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setFormError('');
    if (!formData.barang_id || !formData.gudang_id || !formData.jumlah) {
      setFormError('Barang, Gudang, dan Jumlah wajib diisi');
      return;
    }

    setSubmitting(true);
    try {
      const url = editing ? `/api/stocks/${editing.id}` : '/api/stocks';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!json.success) {
        setFormError(json.message || 'Gagal menyimpan data');
        return;
      }
      setShowModal(false);
      fetchData();
    } catch {
      setFormError('Terjadi kesalahan jaringan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/stocks/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!json.success) {
        alert(json.message || 'Gagal menghapus data');
        return;
      }
      setDeleteTarget(null);
      fetchData();
    } catch {
      alert('Terjadi kesalahan jaringan');
    }
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const formatDate = (d: string | null) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID');
  };

  const getKondisiBadge = (kondisi: string) => {
    const styles: Record<string, string> = {
      baik: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      rusak: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      expired: 'bg-red-500/10 text-red-600 border-red-500/20',
    };
    return `inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${styles[kondisi] || styles.baik}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Stok Gudang</h1>
            <p className="text-sm text-muted-foreground">Manajemen stok logistik seluruh gudang</p>
          </div>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          Tambah Stok
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari barang atau gudang..." className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20" />
          </div>
          <select value={filterJenis} onChange={(e) => { setFilterJenis(e.target.value); setPage(1); }} className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 sm:w-40">
            <option value="all">Semua Jenis</option>
            {jenisList.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
          <select value={filterKondisi} onChange={(e) => { setFilterKondisi(e.target.value); setPage(1); }} className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 sm:w-40">
            <option value="all">Semua Kondisi</option>
            <option value="baik">Baik</option>
            <option value="rusak">Rusak</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {[
                  { key: 'namaBarang', label: 'Nama Barang' },
                  { key: 'jenis', label: 'Jenis' },
                  { key: 'gudang', label: 'Gudang' },
                  { key: 'jumlah', label: 'Jumlah' },
                  { key: 'satuan', label: 'Satuan' },
                  { key: 'expired', label: 'Expired' },
                  { key: 'kondisi', label: 'Kondisi' },
                ].map(col => (
                  <th key={col.key} className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort(col.key)}>
                    {col.label}<SortIcon col={col.key} />
                  </th>
                ))}
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-muted-foreground w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">Memuat data...</td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">Tidak ada data ditemukan</td></tr>
              ) : paged.map(item => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{item.barang.nama_barang}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{item.barang.jenis_logistik.nama_jenis}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{item.gudang.nama_gudang}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{item.jumlah.toLocaleString('id-ID')}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{item.barang.satuan.nama_satuan}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(item.expired_date)}</td>
                  <td className="whitespace-nowrap px-4 py-3"><span className={getKondisiBadge(item.kondisi)}>{item.kondisi}</span></td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteTarget(item)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {filtered.length > 0 ? `Menampilkan ${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, filtered.length)} dari ${filtered.length}` : 'Tidak ada data'}
          </p>
          <div className="flex gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded-lg border border-border p-2 text-sm hover:bg-muted disabled:opacity-40 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg border border-border p-2 text-sm hover:bg-muted disabled:opacity-40 transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              {editing ? 'Edit Stok' : 'Tambah Stok'}
            </h2>

            {formError && (
              <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">{formError}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Barang <span className="text-destructive">*</span></label>
                <select value={formData.barang_id} onChange={(e) => setFormData(f => ({ ...f, barang_id: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                  <option value="">Pilih Barang</option>
                  {barangOptions.map((b: any) => <option key={b.id} value={b.id}>{b.nama_barang} ({b.jenis_logistik?.nama_jenis})</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Gudang <span className="text-destructive">*</span></label>
                <select value={formData.gudang_id} onChange={(e) => setFormData(f => ({ ...f, gudang_id: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                  <option value="">Pilih Gudang</option>
                  {gudangOptions.map((g: any) => <option key={g.id} value={g.id}>{g.nama_gudang}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Jumlah <span className="text-destructive">*</span></label>
                <input type="number" min="0" value={formData.jumlah} onChange={(e) => setFormData(f => ({ ...f, jumlah: e.target.value }))} placeholder="Jumlah stok" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tanggal Expired</label>
                <input type="date" value={formData.expired_date} onChange={(e) => setFormData(f => ({ ...f, expired_date: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Kondisi</label>
                <select value={formData.kondisi} onChange={(e) => setFormData(f => ({ ...f, kondisi: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                  <option value="baik">Baik</option>
                  <option value="rusak">Rusak</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Batal</button>
              <button onClick={handleSubmit} disabled={submitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {submitting ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation */}
      {deleteTarget && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-2 text-lg font-semibold text-foreground">Hapus Stok</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Hapus stok <strong>{deleteTarget.barang.nama_barang}</strong> di <strong>{deleteTarget.gudang.nama_gudang}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Batal</button>
              <button onClick={handleDelete} className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors">Hapus</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default StokGudangPage;
