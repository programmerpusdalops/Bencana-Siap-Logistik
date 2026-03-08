import { PageHeader } from '@/components/layout/PageHeader';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { konfirmasiData, distribusiData } from '@/data/dummyData';

// BACKEND API REQUIRED
// POST /api/konfirmasi - KonfirmasiPenerimaan => KonfirmasiPenerimaan
// GET  /api/konfirmasi => KonfirmasiPenerimaan[]

const schema = z.object({
  nomorDistribusi: z.string().min(1, 'Wajib dipilih'),
  barangDiterima: z.string().min(1, 'Wajib diisi'),
  jumlahDiterima: z.coerce.number().min(1, 'Minimal 1'),
  catatan: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const KonfirmasiPage = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Submit konfirmasi:', data);
    toast.success('Konfirmasi penerimaan berhasil!');
    reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Konfirmasi Penerimaan" description="Konfirmasi penerimaan logistik di lokasi" />

      <div className="card-dashboard">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Form Konfirmasi</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label>Nomor Distribusi *</Label>
            <Select onValueChange={v => setValue('nomorDistribusi', v)}>
              <SelectTrigger><SelectValue placeholder="Pilih distribusi" /></SelectTrigger>
              <SelectContent>
                {distribusiData.map(d => (
                  <SelectItem key={d.id} value={d.nomorDistribusi}>{d.nomorDistribusi} — {d.tujuan}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.nomorDistribusi && <p className="mt-1 text-xs text-destructive">{errors.nomorDistribusi.message}</p>}
          </div>
          <div>
            <Label>Barang Diterima *</Label>
            <Input {...register('barangDiterima')} placeholder="Nama barang" />
            {errors.barangDiterima && <p className="mt-1 text-xs text-destructive">{errors.barangDiterima.message}</p>}
          </div>
          <div>
            <Label>Jumlah Diterima *</Label>
            <Input type="number" {...register('jumlahDiterima')} placeholder="0" />
            {errors.jumlahDiterima && <p className="mt-1 text-xs text-destructive">{errors.jumlahDiterima.message}</p>}
          </div>
          <div>
            <Label>Upload Foto Dokumentasi</Label>
            <Input type="file" accept="image/*" className="pt-1.5" />
            <p className="mt-1 text-xs text-muted-foreground">Format: JPG, PNG (maks 5MB)</p>
          </div>
          <div className="md:col-span-2">
            <Label>Catatan</Label>
            <Textarea {...register('catatan')} placeholder="Catatan penerimaan..." />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit">Konfirmasi</Button>
            <Button type="button" variant="outline" onClick={() => reset()}>Reset</Button>
          </div>
        </form>
      </div>

      <div className="card-dashboard overflow-hidden p-0">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Riwayat Konfirmasi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">No. Distribusi</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Barang</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jumlah</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {konfirmasiData.map(k => (
                <tr key={k.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{k.nomorDistribusi}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{k.barangDiterima}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{k.jumlahDiterima}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{k.tanggalTerima}</td>
                  <td className="px-4 py-3 text-muted-foreground">{k.catatan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KonfirmasiPage;
