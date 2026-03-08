import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchInput } from '@/components/ui/SearchInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  jenisLogistikData, barangLogistikData, gudangData, instansiData, kendaraanData
} from '@/data/dummyData';
import { useParams } from 'react-router-dom';

// BACKEND API REQUIRED
// CRUD /api/master/jenis-logistik
// CRUD /api/master/barang-logistik
// CRUD /api/master/gudang
// CRUD /api/master/instansi
// CRUD /api/master/kendaraan

interface Column {
  key: string;
  label: string;
}

const configs: Record<string, { title: string; columns: Column[]; data: any[] }> = {
  'jenis-logistik': {
    title: 'Jenis Logistik',
    columns: [
      { key: 'nama', label: 'Nama' },
      { key: 'keterangan', label: 'Keterangan' },
    ],
    data: jenisLogistikData,
  },
  'barang-logistik': {
    title: 'Barang Logistik',
    columns: [
      { key: 'nama', label: 'Nama' },
      { key: 'jenis', label: 'Jenis' },
      { key: 'satuan', label: 'Satuan' },
    ],
    data: barangLogistikData,
  },
  'gudang': {
    title: 'Gudang',
    columns: [
      { key: 'nama', label: 'Nama' },
      { key: 'alamat', label: 'Alamat' },
      { key: 'kapasitas', label: 'Kapasitas' },
      { key: 'penanggungJawab', label: 'PJ' },
    ],
    data: gudangData,
  },
  'instansi': {
    title: 'Instansi',
    columns: [
      { key: 'nama', label: 'Nama' },
      { key: 'alamat', label: 'Alamat' },
      { key: 'kontak', label: 'Kontak' },
    ],
    data: instansiData,
  },
  'kendaraan': {
    title: 'Kendaraan',
    columns: [
      { key: 'nomorPolisi', label: 'No. Polisi' },
      { key: 'jenis', label: 'Jenis' },
      { key: 'kapasitas', label: 'Kapasitas' },
      { key: 'status', label: 'Status' },
    ],
    data: kendaraanData,
  },
};

const MasterDataPage = () => {
  const { type = 'jenis-logistik' } = useParams();
  const config = configs[type] || configs['jenis-logistik'];
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = config.data.filter(item =>
    Object.values(item).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Master ${config.title}`}
        description={`Kelola data ${config.title.toLowerCase()}`}
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />Tambah
          </Button>
        }
      />

      <div className="card-dashboard">
        <div className="mb-4 max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder={`Cari ${config.title.toLowerCase()}...`} />
        </div>

        <div className="overflow-x-auto -mx-6 -mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                {config.columns.map(col => (
                  <th key={col.key} className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">{col.label}</th>
                ))}
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{i + 1}</td>
                  {config.columns.map(col => (
                    <td key={col.key} className="whitespace-nowrap px-4 py-3 text-foreground">
                      {col.key === 'status' ? <StatusBadge status={item[col.key]} /> : item[col.key]}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => { setModalOpen(true); }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={config.columns.length + 2} className="px-4 py-12 text-center text-muted-foreground">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah {config.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {config.columns.map(col => (
              <div key={col.key}>
                <Label>{col.label}</Label>
                <Input placeholder={col.label} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={() => { toast.success('Data berhasil disimpan! (simulasi)'); setModalOpen(false); }}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Konfirmasi Hapus</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Apakah Anda yakin ingin menghapus data ini?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
            <Button variant="destructive" onClick={() => { toast.success('Data berhasil dihapus! (simulasi)'); setDeleteId(null); }}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterDataPage;
