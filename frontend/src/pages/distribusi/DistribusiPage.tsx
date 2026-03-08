import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { distribusiData } from '@/data/dummyData';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// BACKEND API REQUIRED
// GET  /api/distribusi => Distribusi[]
// POST /api/distribusi - Distribusi => Distribusi

const schema = z.object({
  gudangAsal: z.string().min(1, 'Wajib dipilih'),
  tujuan: z.string().min(1, 'Wajib diisi'),
  tanggalKirim: z.string().min(1, 'Wajib diisi'),
  kendaraan: z.string().min(1, 'Wajib diisi'),
  driver: z.string().min(1, 'Wajib diisi'),
  petugas: z.string().min(1, 'Wajib diisi'),
  items: z.array(z.object({
    barang: z.string().min(1, 'Wajib diisi'),
    jumlah: z.coerce.number().min(1, 'Min 1'),
  })).min(1, 'Min 1 item'),
});

type FormData = z.infer<typeof schema>;

const DistribusiPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { items: [{ barang: '', jumlah: 0 }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const onSubmit = (data: FormData) => {
    console.log('Submit distribusi:', data);
    toast.success('Distribusi berhasil dicatat!');
    reset();
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Distribusi Logistik"
        description="Kelola pengiriman logistik ke lokasi bencana"
        actions={<Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" />Buat Distribusi</Button>}
      />

      {showForm && (
        <div className="card-dashboard animate-fade-in">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Form Distribusi</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label>Gudang Asal *</Label>
                <Select onValueChange={v => setValue('gudangAsal', v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih gudang" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gudang BPBD Pusat">Gudang BPBD Pusat</SelectItem>
                    <SelectItem value="Gudang PMI">Gudang PMI</SelectItem>
                    <SelectItem value="Gudang Dinsos">Gudang Dinsos</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gudangAsal && <p className="mt-1 text-xs text-destructive">{errors.gudangAsal.message}</p>}
              </div>
              <div>
                <Label>Tujuan *</Label>
                <Input {...register('tujuan')} placeholder="Nama posko/lokasi" />
                {errors.tujuan && <p className="mt-1 text-xs text-destructive">{errors.tujuan.message}</p>}
              </div>
              <div>
                <Label>Tanggal Kirim *</Label>
                <Input type="date" {...register('tanggalKirim')} />
                {errors.tanggalKirim && <p className="mt-1 text-xs text-destructive">{errors.tanggalKirim.message}</p>}
              </div>
              <div>
                <Label>Kendaraan *</Label>
                <Input {...register('kendaraan')} placeholder="No. pol / jenis" />
                {errors.kendaraan && <p className="mt-1 text-xs text-destructive">{errors.kendaraan.message}</p>}
              </div>
              <div>
                <Label>Driver *</Label>
                <Input {...register('driver')} placeholder="Nama driver" />
                {errors.driver && <p className="mt-1 text-xs text-destructive">{errors.driver.message}</p>}
              </div>
              <div>
                <Label>Petugas *</Label>
                <Input {...register('petugas')} placeholder="Nama petugas" />
                {errors.petugas && <p className="mt-1 text-xs text-destructive">{errors.petugas.message}</p>}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Barang *</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ barang: '', jumlah: 0 })}><Plus className="mr-1 h-3 w-3" />Tambah</Button>
              </div>
              <div className="space-y-2">
                {fields.map((field, i) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <Input className="flex-1" {...register(`items.${i}.barang`)} placeholder="Nama barang" />
                    <Input className="w-28" type="number" {...register(`items.${i}.jumlah`)} placeholder="Jumlah" />
                    {fields.length > 1 && <Button type="button" variant="outline" size="icon" onClick={() => remove(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Simpan</Button>
              <Button type="button" variant="outline" onClick={() => { reset(); setShowForm(false); }}>Batal</Button>
            </div>
          </form>
        </div>
      )}

      <div className="card-dashboard overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">No. Distribusi</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Gudang</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tujuan</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Kendaraan</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Driver</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {distribusiData.map(d => (
                <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{d.nomorDistribusi}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.gudangAsal}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.tujuan}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.tanggalKirim}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.kendaraan}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.driver}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.items.map(i => `${i.barang}(${i.jumlah})`).join(', ')}</td>
                  <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DistribusiPage;
