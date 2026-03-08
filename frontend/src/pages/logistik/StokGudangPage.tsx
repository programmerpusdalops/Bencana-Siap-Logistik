import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { stockData } from '@/data/dummyData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// BACKEND API REQUIRED
// GET /api/stocks?search=&filter=&page=&limit=&sort= => { data: Stock[], total: number }

const PAGE_SIZE = 5;

const StokGudangPage = () => {
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string>('namaBarang');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let data = [...stockData];
    if (search) data = data.filter(d => d.namaBarang.toLowerCase().includes(search.toLowerCase()) || d.gudang.toLowerCase().includes(search.toLowerCase()));
    if (filterJenis !== 'all') data = data.filter(d => d.jenis === filterJenis);
    if (filterStatus !== 'all') data = data.filter(d => d.status === filterStatus);
    data.sort((a, b) => {
      const av = (a as any)[sortKey];
      const bv = (b as any)[sortKey];
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return data;
  }, [search, filterJenis, filterStatus, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }: { col: string }) => (
    <span className="ml-1 text-xs">{sortKey === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Stok Gudang" description="Manajemen stok logistik seluruh gudang" />

      {/* Filters */}
      <div className="card-dashboard">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchInput value={search} onChange={setSearch} placeholder="Cari barang atau gudang..." />
          </div>
          <Select value={filterJenis} onValueChange={v => { setFilterJenis(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Jenis" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="Pangan">Pangan</SelectItem>
              <SelectItem value="Sandang">Sandang</SelectItem>
              <SelectItem value="Kesehatan">Kesehatan</SelectItem>
              <SelectItem value="Shelter">Shelter</SelectItem>
              <SelectItem value="Peralatan">Peralatan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="card-dashboard overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {[
                  { key: 'namaBarang', label: 'Nama Barang' },
                  { key: 'jenis', label: 'Jenis' },
                  { key: 'gudang', label: 'Gudang' },
                  { key: 'jumlah', label: 'Jumlah' },
                  { key: 'satuan', label: 'Satuan' },
                  { key: 'expired', label: 'Expired' },
                  { key: 'kondisi', label: 'Kondisi' },
                  { key: 'status', label: 'Status' },
                ].map(col => (
                  <th key={col.key} className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort(col.key)}>
                    {col.label}<SortIcon col={col.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map(item => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{item.namaBarang}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{item.jenis}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{item.gudang}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{item.jumlah.toLocaleString('id-ID')}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{item.satuan}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{item.expired}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{item.kondisi}</td>
                  <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={item.status} /></td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">Tidak ada data ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">Menampilkan {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length}</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StokGudangPage;
