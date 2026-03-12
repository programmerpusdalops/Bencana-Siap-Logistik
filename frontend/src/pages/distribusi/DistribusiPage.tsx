import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { getDistribusi, createDistribusi, getPermintaan, fetchWithAuth, getAuthHeaders } from '@/services/api';

const schema = z.object({
  permintaan_id: z.string().min(1, 'Permintaan wajib dipilih'),
  gudang_id: z.string().min(1, 'Gudang wajib dipilih'),
  tanggal_kirim: z.string().min(1, 'Tanggal kirim wajib diisi'),
  kendaraan_id: z.string().min(1, 'Kendaraan wajib dipilih'),
  petugas_id: z.string().min(1, 'Petugas wajib dipilih'),
  items: z.array(z.object({
    barang_id: z.string().min(1, 'Barang wajib dipilih'),
    jumlah: z.coerce.number().min(1, 'Minimal 1'),
  })).min(1, 'Minimal 1 item'),
});

type FormData = z.infer<typeof schema>;

const DistribusiPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [permintaanList, setPermintaanList] = useState<any[]>([]);
  const [gudangList, setGudangList] = useState<any[]>([]);
  const [kendaraanList, setKendaraanList] = useState<any[]>([]);
  const [petugasList, setPetugasList] = useState<any[]>([]);
  const [barangOptions, setBarangOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { items: [{ barang_id: '', jumlah: 0 }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [distribusiData, permintaanData, gudangRes, kendaraanRes, usersRes, barangRes] = await Promise.all([
        getDistribusi(),
        getPermintaan(),
        fetchWithAuth('/api/master/gudang', { headers: getAuthHeaders() }).then(r => r.json()),
        fetchWithAuth('/api/master/kendaraan', { headers: getAuthHeaders() }).then(r => r.json()),
        fetchWithAuth('/api/users', { headers: getAuthHeaders() }).then(r => r.json()),
        fetchWithAuth('/api/master/barang', { headers: getAuthHeaders() }).then(r => r.json()),
      ]);
      setData(distribusiData);
      // Filter: only approved permintaan can be distributed
      setPermintaanList(permintaanData.filter((p: any) => p.status === 'approved'));
      if (gudangRes.success) setGudangList(gudangRes.data);
      if (kendaraanRes.success) setKendaraanList(kendaraanRes.data);
      if (usersRes.success) setPetugasList(Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.items || []);
      if (barangRes.success) setBarangOptions(barangRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onSubmit = async (formData: FormData) => {
    try {
      await createDistribusi({
        permintaan_id: parseInt(formData.permintaan_id),
        gudang_id: parseInt(formData.gudang_id),
        tanggal_kirim: formData.tanggal_kirim,
        kendaraan_id: parseInt(formData.kendaraan_id),
        petugas_id: parseInt(formData.petugas_id),
        items: formData.items.map(i => ({ barang_id: parseInt(i.barang_id), jumlah: i.jumlah })),
      });
      toast.success('Distribusi berhasil dibuat!');
      reset();
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal membuat distribusi');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Distribusi Logistik"
        description="Kelola distribusi logistik ke lokasi bencana"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />Buat Distribusi
          </Button>
        }
      />

      {showForm && (
        <div className="card-dashboard animate-fade-in">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Form Distribusi Logistik</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label>Permintaan (Approved) *</Label>
                <Select onValueChange={v => setValue('permintaan_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih permintaan" /></SelectTrigger>
                  <SelectContent>
                    {permintaanList.map((p: any) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        REQ-{String(p.id).padStart(3, '0')} — {p.bencana?.lokasi}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.permintaan_id && <p className="mt-1 text-xs text-destructive">{errors.permintaan_id.message}</p>}
              </div>
              <div>
                <Label>Gudang Asal *</Label>
                <Select onValueChange={v => setValue('gudang_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih gudang" /></SelectTrigger>
                  <SelectContent>
                    {gudangList.map((g: any) => (
                      <SelectItem key={g.id} value={String(g.id)}>{g.nama_gudang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gudang_id && <p className="mt-1 text-xs text-destructive">{errors.gudang_id.message}</p>}
              </div>
              <div>
                <Label>Tanggal Kirim *</Label>
                <Input type="date" {...register('tanggal_kirim')} />
                {errors.tanggal_kirim && <p className="mt-1 text-xs text-destructive">{errors.tanggal_kirim.message}</p>}
              </div>
              <div>
                <Label>Kendaraan *</Label>
                <Select onValueChange={v => setValue('kendaraan_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih kendaraan" /></SelectTrigger>
                  <SelectContent>
                    {kendaraanList.map((k: any) => (
                      <SelectItem key={k.id} value={String(k.id)}>
                        {k.nama_kendaraan} — {k.nomor_polisi}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.kendaraan_id && <p className="mt-1 text-xs text-destructive">{errors.kendaraan_id.message}</p>}
              </div>
              <div>
                <Label>Petugas *</Label>
                <Select onValueChange={v => setValue('petugas_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih petugas" /></SelectTrigger>
                  <SelectContent>
                    {petugasList.map((u: any) => (
                      <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.petugas_id && <p className="mt-1 text-xs text-destructive">{errors.petugas_id.message}</p>}
              </div>
            </div>

            {/* Dynamic items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Barang yang Didistribusikan *</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ barang_id: '', jumlah: 0 })}>
                  <Plus className="mr-1 h-3 w-3" />Tambah
                </Button>
              </div>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Select onValueChange={v => setValue(`items.${index}.barang_id`, v)}>
                        <SelectTrigger><SelectValue placeholder="Pilih barang" /></SelectTrigger>
                        <SelectContent>
                          {barangOptions.map((b: any) => (
                            <SelectItem key={b.id} value={String(b.id)}>
                              {b.nama_barang} ({b.satuan?.nama_satuan})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-28">
                      <Input type="number" {...register(`items.${index}.jumlah`)} placeholder="Jumlah" />
                    </div>
                    {fields.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Buat Distribusi</Button>
              <Button type="button" variant="outline" onClick={() => { reset(); setShowForm(false); }}>Batal</Button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card-dashboard overflow-hidden p-0">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Daftar Distribusi</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-4 py-8 text-center text-muted-foreground">Memuat data...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Gudang Asal</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tujuan</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tgl Kirim</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Kendaraan</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Petugas</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d: any) => (
                  <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">DIST-{String(d.id).padStart(3, '0')}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.gudang?.nama_gudang}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.permintaan?.bencana?.lokasi}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{new Date(d.tanggal_kirim).toLocaleDateString('id-ID')}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.kendaraan?.nama_kendaraan}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.petugas?.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.detail?.map((i: any) => `${i.barang?.nama_barang} (${i.jumlah})`).join(', ')}</td>
                    <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistribusiPage;
