import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDown } from 'lucide-react';
import { stockData, distribusiData, permintaanData } from '@/data/dummyData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

// BACKEND API REQUIRED
// GET /api/laporan/stok?tanggal=&wilayah=&jenis= => Stock[]
// GET /api/laporan/distribusi?tanggal=&wilayah=&jenis= => Distribusi[]
// GET /api/laporan/permintaan?tanggal=&wilayah=&jenis= => PermintaanLogistik[]
// GET /api/laporan/export/pdf?type=&filters= => binary
// GET /api/laporan/export/excel?type=&filters= => binary

const LaporanPage = () => {
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterWilayah, setFilterWilayah] = useState('all');
  const [filterJenis, setFilterJenis] = useState('all');

  const handleExport = (format: string) => {
    toast.success(`Export ${format.toUpperCase()} berhasil! (simulasi)`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Laporan" description="Laporan stok, distribusi, dan permintaan logistik" />

      {/* Filters */}
      <div className="card-dashboard">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div>
            <Label>Tanggal</Label>
            <Input type="date" value={filterTanggal} onChange={e => setFilterTanggal(e.target.value)} />
          </div>
          <div>
            <Label>Wilayah</Label>
            <Select value={filterWilayah} onValueChange={setFilterWilayah}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Wilayah</SelectItem>
                <SelectItem value="Palu">Palu</SelectItem>
                <SelectItem value="Donggala">Donggala</SelectItem>
                <SelectItem value="Sigi">Sigi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Jenis Logistik</Label>
            <Select value={filterJenis} onValueChange={setFilterJenis}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="Pangan">Pangan</SelectItem>
                <SelectItem value="Sandang">Sandang</SelectItem>
                <SelectItem value="Kesehatan">Kesehatan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('pdf')}><FileDown className="mr-1 h-4 w-4" />PDF</Button>
            <Button variant="outline" onClick={() => handleExport('excel')}><FileDown className="mr-1 h-4 w-4" />Excel</Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="stok">
        <TabsList>
          <TabsTrigger value="stok">Laporan Stok</TabsTrigger>
          <TabsTrigger value="distribusi">Laporan Distribusi</TabsTrigger>
          <TabsTrigger value="permintaan">Laporan Permintaan</TabsTrigger>
        </TabsList>

        <TabsContent value="stok">
          <div className="card-dashboard overflow-hidden p-0 mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Barang</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jenis</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Gudang</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jumlah</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr></thead>
                <tbody>
                  {stockData.map(s => (
                    <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{s.namaBarang}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{s.jenis}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{s.gudang}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{s.jumlah}</td>
                      <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={s.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="distribusi">
          <div className="card-dashboard overflow-hidden p-0 mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">No.</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tujuan</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr></thead>
                <tbody>
                  {distribusiData.map(d => (
                    <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{d.nomorDistribusi}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.tujuan}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.tanggalKirim}</td>
                      <td className="px-4 py-3 text-muted-foreground">{d.items.map(i => `${i.barang}(${i.jumlah})`).join(', ')}</td>
                      <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={d.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="permintaan">
          <div className="card-dashboard overflow-hidden p-0 mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">No.</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Lokasi</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jenis</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr></thead>
                <tbody>
                  {permintaanData.map(p => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{p.nomorPermintaan}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.lokasiBencana}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.jenisBencana}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.tanggalKejadian}</td>
                      <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LaporanPage;
