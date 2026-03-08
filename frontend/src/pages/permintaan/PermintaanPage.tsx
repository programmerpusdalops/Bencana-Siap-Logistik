import { useState } from 'react';
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
import { permintaanData } from '@/data/dummyData';
import { StatusBadge } from '@/components/ui/StatusBadge';

// BACKEND API REQUIRED
// POST /api/permintaan - PermintaanLogistik => PermintaanLogistik
// GET  /api/permintaan => PermintaanLogistik[]

const schema = z.object({
  lokasiBencana: z.string().min(1, 'Lokasi wajib diisi'),
  jenisBencana: z.string().min(1, 'Jenis bencana wajib dipilih'),
  tanggalKejadian: z.string().min(1, 'Tanggal wajib diisi'),
  jumlahKorban: z.coerce.number().min(0, 'Tidak boleh negatif'),
  jumlahPengungsi: z.coerce.number().min(0, 'Tidak boleh negatif'),
  items: z.array(z.object({
    barang: z.string().min(1, 'Barang wajib diisi'),
    jumlah: z.coerce.number().min(1, 'Minimal 1'),
  })).min(1, 'Minimal 1 item'),
});

type FormData = z.infer<typeof schema>;

const PermintaanPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { items: [{ barang: '', jumlah: 0 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const onSubmit = (data: FormData) => {
    console.log('Submit permintaan:', data);
    toast.success('Permintaan logistik berhasil dikirim!');
    reset();
    setShowForm(false);
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label>Lokasi Bencana *</Label>
                <Input {...register('lokasiBencana')} placeholder="Nama lokasi" />
                {errors.lokasiBencana && <p className="mt-1 text-xs text-destructive">{errors.lokasiBencana.message}</p>}
              </div>
              <div>
                <Label>Jenis Bencana *</Label>
                <Select onValueChange={v => setValue('jenisBencana', v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih jenis" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gempa Bumi">Gempa Bumi</SelectItem>
                    <SelectItem value="Banjir">Banjir</SelectItem>
                    <SelectItem value="Tanah Longsor">Tanah Longsor</SelectItem>
                    <SelectItem value="Kebakaran">Kebakaran</SelectItem>
                    <SelectItem value="Tsunami">Tsunami</SelectItem>
                  </SelectContent>
                </Select>
                {errors.jenisBencana && <p className="mt-1 text-xs text-destructive">{errors.jenisBencana.message}</p>}
              </div>
              <div>
                <Label>Tanggal Kejadian *</Label>
                <Input type="date" {...register('tanggalKejadian')} />
                {errors.tanggalKejadian && <p className="mt-1 text-xs text-destructive">{errors.tanggalKejadian.message}</p>}
              </div>
              <div>
                <Label>Jumlah Korban</Label>
                <Input type="number" {...register('jumlahKorban')} placeholder="0" />
              </div>
              <div>
                <Label>Jumlah Pengungsi</Label>
                <Input type="number" {...register('jumlahPengungsi')} placeholder="0" />
              </div>
            </div>

            {/* Dynamic items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Barang yang Diminta *</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ barang: '', jumlah: 0 })}>
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
                      <Input {...register(`items.${index}.barang`)} placeholder="Nama barang" />
                      {errors.items?.[index]?.barang && <p className="mt-1 text-xs text-destructive">{errors.items[index]?.barang?.message}</p>}
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">No. Permintaan</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Lokasi</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jenis Bencana</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {permintaanData.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{p.nomorPermintaan}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.lokasiBencana}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.jenisBencana}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.tanggalKejadian}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.items.map(i => `${i.barang} (${i.jumlah})`).join(', ')}</td>
                  <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PermintaanPage;
