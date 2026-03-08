import { PageHeader } from '@/components/layout/PageHeader';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { barangMasukData } from '@/data/dummyData';
import { StatusBadge } from '@/components/ui/StatusBadge';

// BACKEND API REQUIRED
// POST /api/barang-masuk - BarangMasuk => BarangMasuk
// GET  /api/barang-masuk => BarangMasuk[]

const schema = z.object({
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  gudang: z.string().min(1, 'Gudang wajib dipilih'),
  barang: z.string().min(1, 'Barang wajib diisi'),
  jenis: z.string().min(1, 'Jenis wajib dipilih'),
  jumlah: z.coerce.number().min(1, 'Jumlah minimal 1'),
  satuan: z.string().min(1, 'Satuan wajib diisi'),
  expired: z.string().optional(),
  sumber: z.string().min(1, 'Sumber wajib dipilih'),
  supplier: z.string().min(1, 'Supplier wajib diisi'),
  catatan: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const BarangMasukPage = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Submit barang masuk:', data);
    toast.success('Barang masuk berhasil dicatat!');
    reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Barang Masuk" description="Input data logistik yang masuk ke gudang" />

      {/* Form */}
      <div className="card-dashboard">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Form Barang Masuk</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label>Tanggal Masuk *</Label>
            <Input type="date" {...register('tanggal')} />
            {errors.tanggal && <p className="mt-1 text-xs text-destructive">{errors.tanggal.message}</p>}
          </div>
          <div>
            <Label>Gudang *</Label>
            <Select onValueChange={v => setValue('gudang', v)}>
              <SelectTrigger><SelectValue placeholder="Pilih gudang" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Gudang BPBD Pusat">Gudang BPBD Pusat</SelectItem>
                <SelectItem value="Gudang PMI">Gudang PMI</SelectItem>
                <SelectItem value="Gudang Dinsos">Gudang Dinsos</SelectItem>
              </SelectContent>
            </Select>
            {errors.gudang && <p className="mt-1 text-xs text-destructive">{errors.gudang.message}</p>}
          </div>
          <div>
            <Label>Barang *</Label>
            <Input {...register('barang')} placeholder="Nama barang" />
            {errors.barang && <p className="mt-1 text-xs text-destructive">{errors.barang.message}</p>}
          </div>
          <div>
            <Label>Jenis Logistik *</Label>
            <Select onValueChange={v => setValue('jenis', v)}>
              <SelectTrigger><SelectValue placeholder="Pilih jenis" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pangan">Pangan</SelectItem>
                <SelectItem value="Sandang">Sandang</SelectItem>
                <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                <SelectItem value="Shelter">Shelter</SelectItem>
                <SelectItem value="Peralatan">Peralatan</SelectItem>
              </SelectContent>
            </Select>
            {errors.jenis && <p className="mt-1 text-xs text-destructive">{errors.jenis.message}</p>}
          </div>
          <div>
            <Label>Jumlah *</Label>
            <Input type="number" {...register('jumlah')} placeholder="0" />
            {errors.jumlah && <p className="mt-1 text-xs text-destructive">{errors.jumlah.message}</p>}
          </div>
          <div>
            <Label>Satuan *</Label>
            <Input {...register('satuan')} placeholder="Kg, Dus, Pcs, dll" />
            {errors.satuan && <p className="mt-1 text-xs text-destructive">{errors.satuan.message}</p>}
          </div>
          <div>
            <Label>Expired Date</Label>
            <Input type="date" {...register('expired')} />
          </div>
          <div>
            <Label>Sumber Logistik *</Label>
            <Select onValueChange={v => setValue('sumber', v)}>
              <SelectTrigger><SelectValue placeholder="Pilih sumber" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Donasi">Donasi</SelectItem>
                <SelectItem value="Pembelian">Pembelian</SelectItem>
                <SelectItem value="Bantuan Pemerintah">Bantuan Pemerintah</SelectItem>
              </SelectContent>
            </Select>
            {errors.sumber && <p className="mt-1 text-xs text-destructive">{errors.sumber.message}</p>}
          </div>
          <div>
            <Label>Supplier / Donatur *</Label>
            <Input {...register('supplier')} placeholder="Nama supplier/donatur" />
            {errors.supplier && <p className="mt-1 text-xs text-destructive">{errors.supplier.message}</p>}
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <Label>Catatan</Label>
            <Textarea {...register('catatan')} placeholder="Catatan tambahan..." />
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex gap-2">
            <Button type="submit">Simpan</Button>
            <Button type="button" variant="outline" onClick={() => reset()}>Reset</Button>
          </div>
        </form>
      </div>

      {/* Recent entries */}
      <div className="card-dashboard overflow-hidden p-0">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Riwayat Barang Masuk</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Barang</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jenis</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Gudang</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jumlah</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Sumber</th>
              </tr>
            </thead>
            <tbody>
              {barangMasukData.map(item => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{item.tanggal}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{item.barang}</td>
                  <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={item.jenis} /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{item.gudang}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{item.jumlah} {item.satuan}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{item.sumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BarangMasukPage;
