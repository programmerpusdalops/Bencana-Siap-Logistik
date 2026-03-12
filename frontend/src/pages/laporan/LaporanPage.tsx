import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet, Download } from 'lucide-react';
import { getStocks, getDistribusi, getPermintaan } from '@/services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

type TabKey = 'stok' | 'distribusi' | 'permintaan';

const TAB_TITLES: Record<TabKey, string> = {
  stok: 'Laporan Stok Gudang',
  distribusi: 'Laporan Distribusi Logistik',
  permintaan: 'Laporan Permintaan Logistik',
};

// ─── Helper: build table data per tab ───────────────────────────────────────────
const buildTableData = (tab: TabKey, data: any[]) => {
  switch (tab) {
    case 'stok':
      return {
        columns: ['No', 'Nama Barang', 'Jenis', 'Gudang', 'Jumlah', 'Satuan', 'Kondisi'],
        rows: data.map((s, i) => [
          i + 1,
          s.barang?.nama_barang || '-',
          s.barang?.jenis_logistik?.nama_jenis || '-',
          s.gudang?.nama_gudang || '-',
          s.jumlah,
          s.barang?.satuan?.nama_satuan || '-',
          s.kondisi || '-',
        ]),
      };
    case 'distribusi':
      return {
        columns: ['No. Distribusi', 'Gudang', 'Tujuan', 'Tgl Kirim', 'Kendaraan', 'Petugas', 'Item', 'Status'],
        rows: data.map((d) => [
          `DIST-${String(d.id).padStart(3, '0')}`,
          d.gudang?.nama_gudang || '-',
          d.permintaan?.bencana?.lokasi || '-',
          new Date(d.tanggal_kirim).toLocaleDateString('id-ID'),
          d.kendaraan?.nama_kendaraan || '-',
          d.petugas?.name || '-',
          d.detail?.map((i: any) => `${i.barang?.nama_barang} (${i.jumlah})`).join(', ') || '-',
          d.status || '-',
        ]),
      };
    case 'permintaan':
      return {
        columns: ['No. Permintaan', 'Lokasi', 'Jenis Bencana', 'Tanggal', 'Pemohon', 'Item', 'Status'],
        rows: data.map((p) => [
          `REQ-${String(p.id).padStart(3, '0')}`,
          p.bencana?.lokasi || '-',
          p.bencana?.jenis_bencana || '-',
          new Date(p.tanggal).toLocaleDateString('id-ID'),
          p.pemohon?.name || '-',
          p.detail?.map((i: any) => `${i.barang?.nama_barang} (${i.jumlah})`).join(', ') || '-',
          p.status || '-',
        ]),
      };
  }
};

const LaporanPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('stok');
  const [stockData, setStockData] = useState<any[]>([]);
  const [distribusiData, setDistribusiData] = useState<any[]>([]);
  const [permintaanData, setPermintaanData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [s, d, p] = await Promise.all([getStocks(), getDistribusi(), getPermintaan()]);
        setStockData(s);
        setDistribusiData(d);
        setPermintaanData(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'stok': return stockData;
      case 'distribusi': return distribusiData;
      case 'permintaan': return permintaanData;
    }
  };

  // ─── Export to PDF ──────────────────────────────────────────────────────────────
  const exportPDF = () => {
    const data = getCurrentData();
    const { columns, rows } = buildTableData(activeTab, data);
    const title = TAB_TITLES[activeTab];
    const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SIAP LOGISTIK BENCANA', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Badan Penanggulangan Bencana Daerah (BPBD)', doc.internal.pageSize.getWidth() / 2, 21, { align: 'center' });

    // Line separator
    doc.setDrawColor(50, 80, 140);
    doc.setLineWidth(0.8);
    doc.line(14, 25, doc.internal.pageSize.getWidth() - 14, 25);

    // Report title & date
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 33);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tanggal cetak: ${now}`, 14, 38);

    // Table
    autoTable(doc, {
      startY: 42,
      head: [columns],
      body: rows,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 65, 122],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 8.5,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [240, 243, 250],
      },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.3,
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data: any) => {
        // Footer on each page
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text(
          `Halaman ${data.pageNumber} dari ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: 'center' }
        );
      },
    });

    // Summary row
    const finalY = (doc as any).lastAutoTable?.finalY || 42;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Data: ${rows.length} baris`, 14, finalY + 8);

    const filename = `${activeTab}_laporan_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  };

  // ─── Export to Excel ────────────────────────────────────────────────────────────
  const exportExcel = () => {
    const data = getCurrentData();
    const { columns, rows } = buildTableData(activeTab, data);
    const title = TAB_TITLES[activeTab];

    // Build worksheet data with header rows
    const wsData = [
      ['SIAP LOGISTIK BENCANA'],
      ['Badan Penanggulangan Bencana Daerah (BPBD)'],
      [],
      [title],
      [`Tanggal cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`],
      [],
      columns,
      ...rows,
      [],
      [`Total Data: ${rows.length} baris`],
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Column widths
    ws['!cols'] = columns.map((_: string, i: number) => ({
      wch: Math.max(
        columns[i].length + 2,
        ...rows.map((r: any[]) => String(r[i] ?? '').length + 2)
      ),
    }));

    // Merge header rows
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: columns.length - 1 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: columns.length - 1 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: columns.length - 1 } },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab === 'stok' ? 'Stok Gudang' : activeTab === 'distribusi' ? 'Distribusi' : 'Permintaan');

    const filename = `${activeTab}_laporan_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'stok', label: 'Stok Gudang' },
    { key: 'distribusi', label: 'Distribusi' },
    { key: 'permintaan', label: 'Permintaan' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan"
        description="Laporan stok, distribusi, dan permintaan logistik"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportPDF} disabled={loading}>
              <FileText className="mr-2 h-4 w-4" />Export PDF
            </Button>
            <Button variant="outline" onClick={exportExcel} disabled={loading}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />Export Excel
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card-dashboard overflow-hidden p-0">
        {loading ? (
          <div className="px-4 py-8 text-center text-muted-foreground">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === 'stok' && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Nama Barang</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jenis</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Gudang</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jumlah</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Satuan</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Kondisi</th>
                  </tr>
                </thead>
                <tbody>
                  {stockData.map((s: any, i: number) => (
                    <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{i + 1}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{s.barang?.nama_barang}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{s.barang?.jenis_logistik?.nama_jenis}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{s.gudang?.nama_gudang}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-foreground font-medium">{s.jumlah}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{s.barang?.satuan?.nama_satuan}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          s.kondisi === 'baik' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                        }`}>{s.kondisi}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'distribusi' && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">No. Distribusi</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Gudang</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tujuan</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tgl Kirim</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Kendaraan</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Petugas</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {distribusiData.map((d: any) => (
                    <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">DIST-{String(d.id).padStart(3, '0')}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.gudang?.nama_gudang}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.permintaan?.bencana?.lokasi}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{new Date(d.tanggal_kirim).toLocaleDateString('id-ID')}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.kendaraan?.nama_kendaraan}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{d.petugas?.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{d.detail?.map((i: any) => `${i.barang?.nama_barang} (${i.jumlah})`).join(', ')}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          d.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        }`}>{d.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'permintaan' && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">No. Permintaan</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Lokasi</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jenis Bencana</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Pemohon</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {permintaanData.map((p: any) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">REQ-{String(p.id).padStart(3, '0')}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.bencana?.lokasi}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.bencana?.jenis_bencana}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{new Date(p.tanggal).toLocaleDateString('id-ID')}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.pemohon?.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.detail?.map((i: any) => `${i.barang?.nama_barang} (${i.jumlah})`).join(', ')}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.status === 'approved' ? 'bg-success/10 text-success'
                          : p.status === 'rejected' ? 'bg-destructive/10 text-destructive'
                          : 'bg-warning/10 text-warning'
                        }`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LaporanPage;
