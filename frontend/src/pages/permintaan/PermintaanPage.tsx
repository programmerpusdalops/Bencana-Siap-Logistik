import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getPermintaan, createPermintaan, getBencana, fetchWithAuth, getAuthHeaders } from '@/services/api';

const schema = z.object({
  bencana_id: z.string().min(1, 'Bencana wajib dipilih'),
  items: z.array(z.object({
    barang_id: z.string().min(1, 'Barang wajib dipilih'),
    jumlah: z.coerce.number().min(1, 'Minimal 1'),
  })).min(1, 'Minimal 1 item'),
});

type FormData = z.infer<typeof schema>;

const PermintaanPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [bencanaList, setBencanaList] = useState<any[]>([]);
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
      const [permintaanData, bData, barangRes] = await Promise.all([
        getPermintaan(),
        getBencana(),
        fetchWithAuth('/api/master/barang', { headers: getAuthHeaders() }).then(r => r.json()),
      ]);
      setData(permintaanData);
      setBencanaList(bData);
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
      await createPermintaan({
        bencana_id: parseInt(formData.bencana_id),
        items: formData.items.map(i => ({ barang_id: parseInt(i.barang_id), jumlah: i.jumlah })),
      });
      toast.success('Permintaan logistik berhasil dikirim!');
      reset();
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal membuat permintaan');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permintaan Logistik"
        description="Ajukan permintaan logistik untuk bencana"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />Buat Permintaan
          </Button>
        }
      />

      {showForm && (
        <div className="card-dashboard animate-fade-in">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Form Permintaan Logistik</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Bencana *</Label>
                <Select onValueChange={v => setValue('bencana_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih bencana" /></SelectTrigger>
                  <SelectContent>
                    {bencanaList.map((b: any) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.jenis_bencana} — {b.lokasi} ({new Date(b.tanggal).toLocaleDateString('id-ID')})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bencana_id && <p className="mt-1 text-xs text-destructive">{errors.bencana_id.message}</p>}
              </div>
            </div>

            {/* Dynamic items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Barang yang Diminta *</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ barang_id: '', jumlah: 0 })}>
                  <Plus className="mr-1 h-3 w-3" />Tambah
                </Button>
              </div>
              {errors.items && typeof errors.items.message === 'string' && (
                <p className="mb-2 text-xs text-destructive">{errors.items.message}</p>
              )}
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
                      {errors.items?.[index]?.barang_id && <p className="mt-1 text-xs text-destructive">{errors.items[index]?.barang_id?.message}</p>}
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
              <Button type="submit">Kirim Permintaan</Button>
              <Button type="button" variant="outline" onClick={() => { reset(); setShowForm(false); }}>Batal</Button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card-dashboard overflow-hidden p-0">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Daftar Permintaan</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-4 py-8 text-center text-muted-foreground">Memuat data...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Lokasi Bencana</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jenis Bencana</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p: any) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">REQ-{String(p.id).padStart(3, '0')}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.bencana?.lokasi}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.bencana?.jenis_bencana}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{new Date(p.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.detail?.map((i: any) => `${i.barang?.nama_barang} (${i.jumlah})`).join(', ')}</td>
                    <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={p.status} /></td>
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

export default PermintaanPage;
