import { useState, useEffect, useCallback } from 'react';
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
import { Plus, Upload, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { getPenerimaan, createPenerimaan, getDistribusi } from '@/services/api';

const schema = z.object({
  distribusi_id: z.string().min(1, 'Distribusi wajib dipilih'),
  catatan: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const KonfirmasiPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [distribusiList, setDistribusiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const [gettingLocation, setGettingLocation] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [penerimaanData, distribusiData] = await Promise.all([
        getPenerimaan(),
        getDistribusi(),
      ]);
      setData(penerimaanData);
      setDistribusiList(distribusiData.filter((d: any) => d.status !== 'completed'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ─── GPS Geolocation ─────────────────────────────────────────────────────────
  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Browser Anda tidak mendukung Geolocation');
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(String(position.coords.latitude));
        setLng(String(position.coords.longitude));
        setGettingLocation(false);
        toast.success('Lokasi berhasil didapat!');
      },
      (error) => {
        setGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Izin lokasi ditolak. Silakan aktifkan izin lokasi pada browser.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Informasi lokasi tidak tersedia.');
            break;
          case error.TIMEOUT:
            toast.error('Permintaan lokasi timeout.');
            break;
          default:
            toast.error('Gagal mendapatkan lokasi.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const onSubmit = async (formData: FormData) => {
    try {
      const fd = new FormData();
      fd.append('distribusi_id', formData.distribusi_id);
      if (formData.catatan) fd.append('catatan', formData.catatan);
      if (file) fd.append('dokumentasi', file);
      if (lat && lng) {
        fd.append('latitude', lat);
        fd.append('longitude', lng);
      }

      await createPenerimaan(fd as any);
      toast.success('Konfirmasi penerimaan berhasil!');
      reset();
      setFile(null);
      setLat('');
      setLng('');
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal membuat konfirmasi');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Konfirmasi Penerimaan"
        description="Konfirmasi penerimaan logistik di posko dengan lokasi GPS dan foto dokumentasi"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />Buat Konfirmasi
          </Button>
        }
      />

      {showForm && (
        <div className="card-dashboard animate-fade-in">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Form Konfirmasi Penerimaan</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Distribusi *</Label>
                <Select onValueChange={v => setValue('distribusi_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih distribusi" /></SelectTrigger>
                  <SelectContent>
                    {distribusiList.map((d: any) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        DIST-{String(d.id).padStart(3, '0')} — {d.permintaan?.bencana?.lokasi} ({d.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.distribusi_id && <p className="mt-1 text-xs text-destructive">{errors.distribusi_id.message}</p>}
              </div>
              <div>
                <Label>Foto Dokumentasi</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                  />
                  {file && <Upload className="h-4 w-4 text-success" />}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Format: JPG/PNG, maks 5MB</p>
              </div>
            </div>

            {/* GPS Location Section */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold">Lokasi Penerimaan (GPS)</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Deteksi otomatis dari perangkat, atau masukkan koordinat secara manual.
                  </p>
                </div>
                <Button
                  type="button"
                  variant={(lat && lng) ? 'outline' : 'default'}
                  size="sm"
                  onClick={getGPSLocation}
                  disabled={gettingLocation}
                >
                  {gettingLocation ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mendeteksi...</>
                  ) : (lat && lng) ? (
                    <><CheckCircle className="mr-2 h-4 w-4 text-success" />Perbarui Lokasi</>
                  ) : (
                    <><MapPin className="mr-2 h-4 w-4" />Dapatkan Lokasi GPS</>
                  )}
                </Button>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Latitude</Label>
                  <Input 
                    placeholder="Contoh: -0.8917" 
                    value={lat} 
                    onChange={(e) => setLat(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Longitude</Label>
                  <Input 
                    placeholder="Contoh: 119.8707" 
                    value={lng} 
                    onChange={(e) => setLng(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Catatan</Label>
              <Textarea {...register('catatan')} placeholder="Catatan penerimaan (opsional)" rows={3} />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Kirim Konfirmasi</Button>
              <Button type="button" variant="outline" onClick={() => { reset(); setFile(null); setLat(''); setLng(''); setShowForm(false); }}>Batal</Button>
            </div>
          </form>
        </div>
      )}

      {/* History */}
      <div className="card-dashboard overflow-hidden p-0">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Riwayat Konfirmasi Penerimaan</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-4 py-8 text-center text-muted-foreground">Memuat data...</div>
          ) : data.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">Belum ada data konfirmasi penerimaan</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">No. Distribusi</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tgl Terima</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Petugas</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Lokasi</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Catatan</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Dokumentasi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p: any) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{p.id}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">DIST-{String(p.distribusi?.id).padStart(3, '0')}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{new Date(p.tanggal_terima).toLocaleDateString('id-ID')}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.petugas_posko}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {p.latitude && p.longitude ? (
                        <span className="inline-flex items-center gap-1 text-xs text-primary">
                          <MapPin className="h-3 w-3" />
                          {Number(p.latitude).toFixed(4)}, {Number(p.longitude).toFixed(4)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.catatan || '-'}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {p.dokumentasi ? (
                        <a href={p.dokumentasi} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">Lihat Foto</a>
                      ) : '-'}
                    </td>
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

export default KonfirmasiPage;
