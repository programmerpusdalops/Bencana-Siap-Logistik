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
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useEffect, useState, useCallback } from 'react';
import { getBarangMasuk, createBarangMasuk, fetchWithAuth, getAuthHeaders } from '@/services/api';

// BACKEND API CONNECTED
// POST /api/barang-masuk => BarangMasuk
// GET  /api/barang-masuk => BarangMasuk[]

const schema = z.object({
  tanggal_masuk: z.string().min(1, 'Tanggal wajib diisi'),
  gudang_id: z.string().min(1, 'Gudang wajib dipilih'),
  barang_id: z.string().min(1, 'Barang wajib dipilih'),
  jumlah: z.coerce.number().min(1, 'Jumlah minimal 1'),
  sumber_logistik: z.string().min(1, 'Sumber wajib dipilih'),
  supplier: z.string().min(1, 'Supplier wajib diisi'),
  catatan: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface GudangOption {
  id: number;
  nama_gudang: string;
}

interface BarangOption {
  id: number;
  nama_barang: string;
  jenis_logistik: { nama_jenis: string };
  satuan: { nama_satuan: string };
}

interface BarangMasukRecord {
  id: number;
  tanggal_masuk: string;
  jumlah: number;
  sumber_logistik: string;
  supplier: string;
  catatan: string | null;
  barang: {
    nama_barang: string;
    jenis_logistik: { nama_jenis: string };
    satuan: { nama_satuan: string };
  };
  gudang: {
    nama_gudang: string;
  };
}

const BarangMasukPage = () => {
  const [barangMasukList, setBarangMasukList] = useState<BarangMasukRecord[]>([]);
  const [gudangOptions, setGudangOptions] = useState<GudangOption[]>([]);
  const [barangOptions, setBarangOptions] = useState<BarangOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [masukData, gudangRes, barangRes] = await Promise.all([
        getBarangMasuk(),
        fetchWithAuth('/api/master/gudang', { headers: getAuthHeaders() }).then(r => r.json()),
        fetchWithAuth('/api/master/barang', { headers: getAuthHeaders() }).then(r => r.json()),
      ]);
      setBarangMasukList(masukData);
      if (gudangRes.success) setGudangOptions(gudangRes.data);
      if (barangRes.success) setBarangOptions(barangRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      await createBarangMasuk({
        tanggal_masuk: data.tanggal_masuk,
        barang_id: parseInt(data.barang_id),
        gudang_id: parseInt(data.gudang_id),
        jumlah: data.jumlah,
        sumber_logistik: data.sumber_logistik,
        supplier: data.supplier,
        catatan: data.catatan || '',
      });
      toast.success('Barang masuk berhasil dicatat! Stok gudang telah diperbarui.');
      reset();
      fetchData();
    } catch (error) {
      console.error('Failed to create barang masuk:', error);
      toast.error('Gagal mencatat barang masuk');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
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
            <Input type="date" {...register('tanggal_masuk')} />
            {errors.tanggal_masuk && <p className="mt-1 text-xs text-destructive">{errors.tanggal_masuk.message}</p>}
          </div>
          <div>
            <Label>Gudang *</Label>
            <Select onValueChange={v => setValue('gudang_id', v)}>
              <SelectTrigger><SelectValue placeholder="Pilih gudang" /></SelectTrigger>
              <SelectContent>
                {gudangOptions.map(g => (
                  <SelectItem key={g.id} value={String(g.id)}>{g.nama_gudang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.gudang_id && <p className="mt-1 text-xs text-destructive">{errors.gudang_id.message}</p>}
          </div>
          <div>
            <Label>Barang *</Label>
            <Select onValueChange={v => setValue('barang_id', v)}>
              <SelectTrigger><SelectValue placeholder="Pilih barang" /></SelectTrigger>
              <SelectContent>
                {barangOptions.map(b => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.nama_barang} ({b.satuan.nama_satuan})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.barang_id && <p className="mt-1 text-xs text-destructive">{errors.barang_id.message}</p>}
          </div>
          <div>
            <Label>Jumlah *</Label>
            <Input type="number" {...register('jumlah')} placeholder="0" />
            {errors.jumlah && <p className="mt-1 text-xs text-destructive">{errors.jumlah.message}</p>}
          </div>
          <div>
            <Label>Sumber Logistik *</Label>
            <Select onValueChange={v => setValue('sumber_logistik', v)}>
              <SelectTrigger><SelectValue placeholder="Pilih sumber" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="APBD">APBD</SelectItem>
                <SelectItem value="BNPB">BNPB</SelectItem>
                <SelectItem value="Donasi">Donasi</SelectItem>
                <SelectItem value="CSR">CSR</SelectItem>
                <SelectItem value="Pembelian">Pembelian</SelectItem>
                <SelectItem value="Bantuan Pemerintah">Bantuan Pemerintah</SelectItem>
              </SelectContent>
            </Select>
            {errors.sumber_logistik && <p className="mt-1 text-xs text-destructive">{errors.sumber_logistik.message}</p>}
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
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
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
          {loading ? (
            <div className="px-4 py-8 text-center text-muted-foreground">Memuat data...</div>
          ) : barangMasukList.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">Belum ada data barang masuk</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Barang</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jenis</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Gudang</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jumlah</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Sumber</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Supplier</th>
                </tr>
              </thead>
              <tbody>
                {barangMasukList.map(item => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(item.tanggal_masuk)}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{item.barang.nama_barang}</td>
                    <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={item.barang.jenis_logistik.nama_jenis} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{item.gudang.nama_gudang}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{item.jumlah} {item.barang.satuan.nama_satuan}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{item.sumber_logistik}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{item.supplier}</td>
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

export default BarangMasukPage;
