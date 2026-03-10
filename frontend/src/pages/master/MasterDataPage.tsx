/**
 * MasterDataPage — Full CRUD for all master data entities.
 * Fetches real data from backend APIs, replaces dummy data.
 */

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { getAuthHeaders } from '@/services/api';
import { Plus, Pencil, Trash2, Search, Database } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface Column {
  key: string;
  label: string;
  render?: (item: any) => string;
}

interface FormField {
  key: string;
  label: string;
  type: 'text' | 'select';
  required?: boolean;
  options?: { value: string | number; label: string }[];
  placeholder?: string;
}

interface EntityConfig {
  title: string;
  apiPath: string;
  columns: Column[];
  formFields: FormField[];
}

// ─── Entity Configs ─────────────────────────────────────────────────────────────

const configs: Record<string, EntityConfig> = {
  'jenis-logistik': {
    title: 'Jenis Logistik',
    apiPath: '/api/master/jenis-logistik',
    columns: [
      { key: 'nama_jenis', label: 'Nama Jenis' },
    ],
    formFields: [
      { key: 'nama_jenis', label: 'Nama Jenis', type: 'text', required: true, placeholder: 'Contoh: Pangan' },
    ],
  },
  'barang-logistik': {
    title: 'Barang Logistik',
    apiPath: '/api/master/barang',
    columns: [
      { key: 'nama_barang', label: 'Nama Barang' },
      { key: 'jenis_logistik', label: 'Jenis', render: (item: any) => item.jenis_logistik?.nama_jenis || '-' },
      { key: 'satuan', label: 'Satuan', render: (item: any) => item.satuan?.nama_satuan || '-' },
    ],
    formFields: [
      { key: 'nama_barang', label: 'Nama Barang', type: 'text', required: true, placeholder: 'Contoh: Beras' },
      { key: 'jenis_logistik_id', label: 'Jenis Logistik', type: 'select', required: true },
      { key: 'satuan_id', label: 'Satuan', type: 'select', required: true },
    ],
  },
  'gudang': {
    title: 'Gudang',
    apiPath: '/api/master/gudang',
    columns: [
      { key: 'nama_gudang', label: 'Nama Gudang' },
      { key: 'instansi', label: 'Instansi', render: (item: any) => item.instansi?.nama_instansi || '-' },
      { key: 'alamat', label: 'Alamat' },
    ],
    formFields: [
      { key: 'nama_gudang', label: 'Nama Gudang', type: 'text', required: true, placeholder: 'Contoh: Gudang BPBD Pusat' },
      { key: 'instansi_id', label: 'Instansi', type: 'select', required: true },
      { key: 'alamat', label: 'Alamat', type: 'text', placeholder: 'Alamat gudang' },
    ],
  },
  'instansi': {
    title: 'Instansi',
    apiPath: '/api/master/instansi',
    columns: [
      { key: 'nama_instansi', label: 'Nama Instansi' },
      { key: 'jenis_instansi', label: 'Jenis' },
    ],
    formFields: [
      { key: 'nama_instansi', label: 'Nama Instansi', type: 'text', required: true, placeholder: 'Contoh: BPBD Sulteng' },
      { key: 'jenis_instansi', label: 'Jenis Instansi', type: 'text', placeholder: 'Contoh: Pemerintah' },
    ],
  },
  'kendaraan': {
    title: 'Kendaraan',
    apiPath: '/api/master/kendaraan',
    columns: [
      { key: 'nama_kendaraan', label: 'Nama Kendaraan' },
      { key: 'nomor_polisi', label: 'No. Polisi' },
      { key: 'kapasitas', label: 'Kapasitas' },
    ],
    formFields: [
      { key: 'nama_kendaraan', label: 'Nama Kendaraan', type: 'text', required: true, placeholder: 'Contoh: Truk BPBD' },
      { key: 'nomor_polisi', label: 'Nomor Polisi', type: 'text', required: true, placeholder: 'Contoh: B 1234 CD' },
      { key: 'kapasitas', label: 'Kapasitas', type: 'text', placeholder: 'Contoh: 5 Ton' },
    ],
  },
};

// Satuan is not in the sidebar but we add a route config for it
configs['satuan'] = {
  title: 'Satuan',
  apiPath: '/api/master/satuan',
  columns: [
    { key: 'nama_satuan', label: 'Nama Satuan' },
  ],
  formFields: [
    { key: 'nama_satuan', label: 'Nama Satuan', type: 'text', required: true, placeholder: 'Contoh: Kg' },
  ],
};

// ─── Component ──────────────────────────────────────────────────────────────────

const MasterDataPage = () => {
  const { type = 'jenis-logistik' } = useParams();
  const config = configs[type] || configs['jenis-logistik'];

  // State
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Dropdown options for relational fields
  const [jenisLogistikOptions, setJenisLogistikOptions] = useState<any[]>([]);
  const [satuanOptions, setSatuanOptions] = useState<any[]>([]);
  const [instansiOptions, setInstansiOptions] = useState<any[]>([]);

  // ─── Fetch data ─────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(config.apiPath, { headers: getAuthHeaders() });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [config.apiPath]);

  // ─── Fetch dropdown options ─────────────────────────────────────────────────
  const fetchDropdownOptions = useCallback(async () => {
    try {
      if (type === 'barang-logistik') {
        const [jenisRes, satuanRes] = await Promise.all([
          fetch('/api/master/jenis-logistik', { headers: getAuthHeaders() }),
          fetch('/api/master/satuan', { headers: getAuthHeaders() }),
        ]);
        const jenisJson = await jenisRes.json();
        const satuanJson = await satuanRes.json();
        if (jenisJson.success) setJenisLogistikOptions(jenisJson.data);
        if (satuanJson.success) setSatuanOptions(satuanJson.data);
      }
      if (type === 'gudang') {
        const instansiRes = await fetch('/api/master/instansi', { headers: getAuthHeaders() });
        const instansiJson = await instansiRes.json();
        if (instansiJson.success) setInstansiOptions(instansiJson.data);
      }
    } catch (err) {
      console.error('Dropdown fetch error:', err);
    }
  }, [type]);

  useEffect(() => {
    fetchData();
    fetchDropdownOptions();
    setSearch('');
  }, [fetchData, fetchDropdownOptions]);

  // ─── Filter data ────────────────────────────────────────────────────────────
  const filtered = data.filter(item =>
    config.columns.some(col => {
      const value = col.render ? col.render(item) : String(item[col.key] || '');
      return value.toLowerCase().includes(search.toLowerCase());
    })
  );

  // ─── Build form field options ───────────────────────────────────────────────
  const getFieldOptions = (fieldKey: string) => {
    if (fieldKey === 'jenis_logistik_id') {
      return jenisLogistikOptions.map(j => ({ value: j.id, label: j.nama_jenis }));
    }
    if (fieldKey === 'satuan_id') {
      return satuanOptions.map(s => ({ value: s.id, label: s.nama_satuan }));
    }
    if (fieldKey === 'instansi_id') {
      return instansiOptions.map(i => ({ value: i.id, label: i.nama_instansi }));
    }
    return [];
  };

  // ─── Open create modal ──────────────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setFormError('');
    const emptyForm: Record<string, string> = {};
    config.formFields.forEach(f => { emptyForm[f.key] = ''; });
    setFormData(emptyForm);
    setShowModal(true);
  };

  // ─── Open edit modal ────────────────────────────────────────────────────────
  const openEdit = (item: any) => {
    setEditing(item);
    setFormError('');
    const fillForm: Record<string, string> = {};
    config.formFields.forEach(f => {
      fillForm[f.key] = String(item[f.key] || '');
    });
    setFormData(fillForm);
    setShowModal(true);
  };

  // ─── Submit (create or update) ──────────────────────────────────────────────
  const handleSubmit = async () => {
    setFormError('');
    // Validate required fields
    for (const field of config.formFields) {
      if (field.required && !formData[field.key]?.trim()) {
        setFormError(`${field.label} wajib diisi`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const url = editing ? `${config.apiPath}/${editing.id}` : config.apiPath;
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
    } catch (err) {
      setFormError('Terjadi kesalahan jaringan');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Handle delete ──────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${config.apiPath}/${deleteTarget.id}`, {
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
    } catch (err) {
      alert('Terjadi kesalahan jaringan');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Master {config.title}</h1>
            <p className="text-sm text-muted-foreground">Kelola data {config.title.toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah {config.title}
        </button>
      </div>

      {/* Search + Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Cari ${config.title.toLowerCase()}...`}
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border bg-muted/50">
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground w-12">#</th>
                {config.columns.map(col => (
                  <th key={col.key} className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">{col.label}</th>
                ))}
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-muted-foreground w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={config.columns.length + 2} className="px-4 py-12 text-center text-muted-foreground">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={config.columns.length + 2} className="px-4 py-12 text-center text-muted-foreground">Tidak ada data</td></tr>
              ) : (
                filtered.map((item, i) => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{i + 1}</td>
                    {config.columns.map(col => (
                      <td key={col.key} className="whitespace-nowrap px-4 py-3 text-foreground">
                        {col.render ? col.render(item) : (item[col.key] || '-')}
                      </td>
                    ))}
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              {editing ? `Edit ${config.title}` : `Tambah ${config.title}`}
            </h2>

            {formError && (
              <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              {config.formFields.map(field => (
                <div key={field.key}>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Pilih {field.label}</option>
                      {getFieldOptions(field.key).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData(f => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
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
            <h2 className="mb-2 text-lg font-semibold text-foreground">Hapus {config.title}</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                Batal
              </button>
              <button onClick={handleDelete} className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors">
                Hapus
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default MasterDataPage;
