/**
 * BencanaPage — Disaster Events Management
 * CRUD for /api/bencana with search, filter, sort, and pagination.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { fetchWithAuth, getAuthHeaders } from '@/services/api';
import { Flame, Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const PAGE_SIZE = 10;

interface BencanaItem {
  id: number;
  jenis_bencana: string;
  lokasi: string;
  latitude: number | null;
  longitude: number | null;
  tanggal: string;
  jumlah_pengungsi: number;
  jumlah_korban: number;
}

const BencanaPage = () => {
  const { user } = useAuth();
  const hasAccessEdit = ['super_admin', 'admin_pusdalops'].includes(user?.role || '');

  const [data, setData] = useState<BencanaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('all');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('tanggal');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BencanaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BencanaItem | null>(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    jenis_bencana: '',
    lokasi: '',
    tanggal: '',
    jumlah_korban: '',
    jumlah_pengungsi: '',
    latitude: '',
    longitude: '',
  });

  // ─── Fetch ────────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/bencana', { headers: getAuthHeaders() });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ─── Filter helpers ───────────────────────────────────────────────────────────
  const jenisList = useMemo(() => {
    const set = new Set(data.map(d => d.jenis_bencana));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    let result = [...data];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(d => d.lokasi.toLowerCase().includes(s) || d.jenis_bencana.toLowerCase().includes(s));
    }
    if (filterJenis !== 'all') {
      result = result.filter(d => d.jenis_bencana === filterJenis);
    }
    result.sort((a, b) => {
      let av: any, bv: any;
      switch (sortKey) {
        case 'tanggal': av = new Date(a.tanggal).getTime(); bv = new Date(b.tanggal).getTime(); break;
        case 'jenis': av = a.jenis_bencana; bv = b.jenis_bencana; break;
        case 'lokasi': av = a.lokasi; bv = b.lokasi; break;
        case 'korban': av = a.jumlah_korban; bv = b.jumlah_korban; break;
        case 'pengungsi': av = a.jumlah_pengungsi; bv = b.jumlah_pengungsi; break;
        default: av = new Date(a.tanggal).getTime(); bv = new Date(b.tanggal).getTime();
      }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return result;
  }, [data, search, filterJenis, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };
  const SortIcon = ({ col }: { col: string }) => (
    <span className="ml-1 text-xs">{sortKey === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span>
  );

  // ─── Modal handlers ───────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setFormError('');
    setFormData({
      jenis_bencana: '', lokasi: '',
      tanggal: new Date().toISOString().split('T')[0],
      jumlah_korban: '0', jumlah_pengungsi: '0',
      latitude: '', longitude: '',
    });
    setShowModal(true);
  };

  const openEdit = (item: BencanaItem) => {
    setEditing(item);
    setFormError('');
    setFormData({
      jenis_bencana: item.jenis_bencana,
      lokasi: item.lokasi,
      tanggal: item.tanggal.split('T')[0],
      jumlah_korban: String(item.jumlah_korban),
      jumlah_pengungsi: String(item.jumlah_pengungsi),
      latitude: item.latitude != null ? String(item.latitude) : '',
      longitude: item.longitude != null ? String(item.longitude) : '',
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setFormError('');
    if (!formData.jenis_bencana || !formData.lokasi || !formData.tanggal) {
      setFormError('Jenis Bencana, Lokasi, dan Tanggal wajib diisi');
      return;
    }

    setSubmitting(true);
    try {
      const url = editing ? `/api/bencana/${editing.id}` : '/api/bencana';
      const method = editing ? 'PUT' : 'POST';

      const payload: any = {
        jenis_bencana: formData.jenis_bencana,
        lokasi: formData.lokasi,
        tanggal: formData.tanggal,
        jumlah_korban: parseInt(formData.jumlah_korban) || 0,
        jumlah_pengungsi: parseInt(formData.jumlah_pengungsi) || 0,
      };

      // Only send coordinates if both are filled
      if (formData.latitude && formData.longitude) {
        payload.latitude = parseFloat(formData.latitude);
        payload.longitude = parseFloat(formData.longitude);
      }

      const res = await fetchWithAuth(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
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
      const res = await fetchWithAuth(`/api/bencana/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!json.success) { alert(json.message || 'Gagal menghapus data'); return; }
      setDeleteTarget(null);
      fetchData();
    } catch {
      alert('Terjadi kesalahan jaringan');
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  // ─── Input helper ─────────────────────────────────────────────────────────────
  const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
            <Flame className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Data Kejadian Bencana</h1>
            <p className="text-sm text-muted-foreground">Pencatatan riwayat kejadian dan lokasi bencana</p>
          </div>
        </div>
        {hasAccessEdit && (
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            Tambah Data
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari kejadian bencana atau lokasi..." className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20" />
          </div>
          <select value={filterJenis} onChange={(e) => { setFilterJenis(e.target.value); setPage(1); }} className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 sm:w-48">
            <option value="all">Semua Jenis Bencana</option>
            {jenisList.map(j => <option key={j} value={j}>{j}</option>)}
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
                  { key: 'tanggal', label: 'Tanggal' },
                  { key: 'jenis', label: 'Jenis Bencana' },
                  { key: 'lokasi', label: 'Lokasi' },
                  { key: 'korban', label: 'Korban Jiwa' },
                  { key: 'pengungsi', label: 'Pengungsi' },
                ].map(col => (
                  <th key={col.key} className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort(col.key)}>
                    {col.label}<SortIcon col={col.key} />
                  </th>
                ))}
                {hasAccessEdit && <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-muted-foreground w-20">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Memuat data...</td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Tidak ada data ditemukan</td></tr>
              ) : paged.map(item => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(item.tanggal)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{item.jenis_bencana}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                      <span className="truncate max-w-[200px]" title={item.lokasi}>{item.lokasi}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground font-medium">{item.jumlah_korban.toLocaleString('id-ID')}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground font-medium">{item.jumlah_pengungsi.toLocaleString('id-ID')}</td>
                  {hasAccessEdit && (
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(item)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(item)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors" title="Hapus">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
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

      {/* ═══════ Create/Edit Modal ═══════ */}
      {showModal && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 py-12"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="border-b border-border py-4">
              <div className="mx-auto flex max-w-sm items-center justify-between px-6">
                
                <h2 className="text-lg font-semibold text-foreground">
                  {editing ? 'Edit Kejadian Bencana' : 'Tambah Kejadian Bencana'}
                </h2>

                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </button>

              </div>
            </div>

            {/* Body */}
            <div className="py-6">
              <div className="mx-auto max-w-sm px-6 space-y-5">

                {/* Error */}
                {formError && (
                  <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    <Flame className="h-4 w-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="space-y-4">

                  {/* Jenis Bencana */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground/90">
                      Jenis Bencana <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.jenis_bencana}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, jenis_bencana: e.target.value }))
                      }
                      placeholder="Contoh: Banjir, Gempa, Tanah Longsor"
                      className={inputClass}
                    />
                  </div>

                  {/* Tanggal & Lokasi */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-foreground/90">
                        Tanggal <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.tanggal}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, tanggal: e.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-foreground/90">
                        Lokasi <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lokasi}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, lokasi: e.target.value }))
                        }
                        placeholder="Kecamatan / Kabupaten"
                        className={inputClass}
                      />
                    </div>

                  </div>

                  {/* Korban & Pengungsi */}
                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-foreground/90">
                        Korban Jiwa
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.jumlah_korban}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            jumlah_korban: e.target.value,
                          }))
                        }
                        placeholder="0"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-foreground/90">
                        Pengungsi
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.jumlah_pengungsi}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            jumlah_pengungsi: e.target.value,
                          }))
                        }
                        placeholder="0"
                        className={inputClass}
                      />
                    </div>

                  </div>

                  {/* Koordinat */}
                  <div className="grid grid-cols-2 gap-4 pt-2">

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Latitude
                        <span className="ml-1 text-[10px] lowercase">(opsional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.latitude}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            latitude: e.target.value,
                          }))
                        }
                        placeholder="-0.8917"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Longitude
                        <span className="ml-1 text-[10px] lowercase">(opsional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.longitude}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            longitude: e.target.value,
                          }))
                        }
                        placeholder="119.8707"
                        className={inputClass}
                      />
                    </div>

                  </div>

                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                Batal
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting
                  ? "Menyimpan..."
                  : editing
                  ? "Simpan Perubahan"
                  : "Simpan"}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ═══════ Delete Confirmation ═══════ */}
      {deleteTarget && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-sm rounded-[2rem] border border-border bg-card p-6 sm:p-8 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">Hapus Data Bencana?</h2>
            <p className="mb-8 text-sm text-muted-foreground leading-relaxed">
              Anda yakin ingin menghapus kejadian <strong>{deleteTarget.jenis_bencana}</strong> di <strong>{deleteTarget.lokasi}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleDelete} className="w-full rounded-xl bg-destructive px-5 py-3 text-sm font-bold text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-md">
                Ya, Hapus Data
              </button>
              <button onClick={() => setDeleteTarget(null)} className="w-full rounded-xl border border-border px-5 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors">
                Batal
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default BencanaPage;
