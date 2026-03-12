import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/hooks/useAuth';
import { fetchWithAuth, getAuthHeaders } from '@/services/api';
import { Plus, Pencil, Trash2, Search, Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface UserRow {
    id: number;
    name: string;
    email: string;
    role: string;
    role_id: number;
    instansi: string | null;
    instansi_id: number | null;
    created_at: string;
}

interface Role {
    id: number;
    name: string;
}

interface Instansi {
    id: number;
    nama_instansi: string;
}

const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin_gudang: 'Admin Gudang',
    admin_pusdalops: 'Admin Pusdalops',
    petugas_posko: 'Petugas Posko',
    pimpinan: 'Pimpinan',
};

const UserManagementPage = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<UserRow[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [instansiList, setInstansiList] = useState<Instansi[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<UserRow | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role_id: '', instansi_id: '' });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`/api/users?page=${page}&limit=10&search=${search}`, {
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.data.items);
                setTotalPages(data.data.pagination.total_pages);
            }
        } catch {
            setError('Gagal memuat data user');
        } finally {
            setLoading(false);
        }
    }, [page, search, token]);

    const fetchRoles = useCallback(async () => {
        try {
            const res = await fetchWithAuth('/api/users/roles', { headers: getAuthHeaders() });
            const data = await res.json();
            if (data.success) setRoles(data.data);
        } catch { /* ignore */ }
    }, [token]);

    const fetchInstansi = useCallback(async () => {
        try {
            const res = await fetchWithAuth('/api/users/instansi', { headers: getAuthHeaders() });
            const data = await res.json();
            if (data.success) setInstansiList(data.data);
        } catch { /* ignore */ }
    }, [token]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);
    useEffect(() => { fetchRoles(); }, [fetchRoles]);
    useEffect(() => { fetchInstansi(); }, [fetchInstansi]);

    const openCreate = () => {
        setEditing(null);
        setFormData({ name: '', email: '', password: '', role_id: '', instansi_id: '' });
        setFormError('');
        setShowModal(true);
    };

    const openEdit = (user: UserRow) => {
        setEditing(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role_id: String(user.role_id),
            instansi_id: user.instansi_id ? String(user.instansi_id) : '',
        });
        setFormError('');
        setShowModal(true);
    };

    const handleSubmit = async () => {
        setFormError('');
        setSubmitting(true);
        try {
            const url = editing ? `/api/users/${editing.id}` : '/api/users';
            const method = editing ? 'PUT' : 'POST';

            const body: Record<string, unknown> = {
                name: formData.name,
                email: formData.email,
                role_id: parseInt(formData.role_id),
            };
            if (formData.password) body.password = formData.password;
            if (formData.instansi_id) body.instansi_id = parseInt(formData.instansi_id);

            const res = await fetchWithAuth(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (!data.success) {
                setFormError(data.message);
                return;
            }

            setShowModal(false);
            fetchUsers();
        } catch {
            setFormError('Terjadi kesalahan');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            const res = await fetchWithAuth(`/api/users/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            if (!data.success) {
                setError(data.message);
            }
            setDeleteTarget(null);
            fetchUsers();
        } catch {
            setError('Gagal menghapus user');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Manajemen User</h1>
                        <p className="text-sm text-muted-foreground">Kelola pengguna sistem</p>
                    </div>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Tambah User
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Cari nama atau email..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nama</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Instansi</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Tidak ada data user</td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 font-medium text-foreground">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                    {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                {u.name}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                {roleLabels[u.role] || u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{u.instansi || '-'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openEdit(u)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => setDeleteTarget(u)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-border px-4 py-3">
                        <p className="text-sm text-muted-foreground">Halaman {page} dari {totalPages}</p>
                        <div className="flex gap-1">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted disabled:opacity-30">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted disabled:opacity-30">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 transition-all" onClick={() => setShowModal(false)}>
                    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mb-4 text-lg font-semibold text-foreground">{editing ? 'Edit User' : 'Tambah User Baru'}</h2>

                        {formError && (
                            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                                {formError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Nama</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">
                                    Password {editing && <span className="text-muted-foreground font-normal">(kosongkan jika tidak diubah)</span>}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData(f => ({ ...f, password: e.target.value }))}
                                    placeholder={editing ? 'Kosongkan jika tidak diubah' : 'Min. 6 karakter'}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Role</label>
                                <select
                                    value={formData.role_id}
                                    onChange={(e) => setFormData(f => ({ ...f, role_id: e.target.value }))}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Pilih Role</option>
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>{roleLabels[r.name] || r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Instansi</label>
                                <select
                                    value={formData.instansi_id}
                                    onChange={(e) => setFormData(f => ({ ...f, instansi_id: e.target.value }))}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Pilih Instansi (opsional)</option>
                                    {instansiList.map(i => (
                                        <option key={i.id} value={i.id}>{i.nama_instansi}</option>
                                    ))}
                                </select>
                            </div>
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
                                {submitting ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah User'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Confirmation */}
            {deleteTarget && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 transition-all" onClick={() => setDeleteTarget(null)}>
                    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mb-2 text-lg font-semibold text-foreground">Hapus User</h2>
                        <p className="mb-6 text-sm text-muted-foreground">
                            Apakah Anda yakin ingin menghapus <strong>{deleteTarget.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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

export default UserManagementPage;
