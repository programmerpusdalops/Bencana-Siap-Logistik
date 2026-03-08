import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { permintaanData } from '@/data/dummyData';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import type { PermintaanLogistik } from '@/types';

// BACKEND API REQUIRED
// GET /api/permintaan => PermintaanLogistik[]
// PUT /api/permintaan/:id/approve => void
// PUT /api/permintaan/:id/reject => void

const VerifikasiPage = () => {
  const [data, setData] = useState(permintaanData);
  const [selected, setSelected] = useState<PermintaanLogistik | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: number; action: 'approve' | 'reject' } | null>(null);

  const handleAction = () => {
    if (!confirmAction) return;
    setData(prev => prev.map(d =>
      d.id === confirmAction.id
        ? { ...d, status: confirmAction.action === 'approve' ? 'Approved' as const : 'Rejected' as const }
        : d
    ));
    toast.success(confirmAction.action === 'approve' ? 'Permintaan disetujui!' : 'Permintaan ditolak!');
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Verifikasi Permintaan" description="Verifikasi dan setujui permintaan logistik bencana" />

      <div className="card-dashboard overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">No. Permintaan</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Lokasi</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jenis Bencana</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{p.nomorPermintaan}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.lokasiBencana}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.jenisBencana}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.tanggalKejadian}</td>
                  <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => setSelected(p)}>
                        <Eye className="h-3 w-3 mr-1" />Detail
                      </Button>
                      {p.status === 'Pending' && (
                        <>
                          <Button size="sm" onClick={() => setConfirmAction({ id: p.id, action: 'approve' })}>
                            <CheckCircle className="h-3 w-3 mr-1" />Approve
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setConfirmAction({ id: p.id, action: 'reject' })}>
                            <XCircle className="h-3 w-3 mr-1" />Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Permintaan {selected?.nomorPermintaan}</DialogTitle>
            <DialogDescription>Informasi lengkap permintaan logistik</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Lokasi:</span> <span className="font-medium text-foreground">{selected.lokasiBencana}</span></div>
                <div><span className="text-muted-foreground">Jenis:</span> <span className="font-medium text-foreground">{selected.jenisBencana}</span></div>
                <div><span className="text-muted-foreground">Korban:</span> <span className="font-medium text-foreground">{selected.jumlahKorban}</span></div>
                <div><span className="text-muted-foreground">Pengungsi:</span> <span className="font-medium text-foreground">{selected.jumlahPengungsi}</span></div>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Barang diminta:</p>
                <ul className="space-y-1">
                  {selected.items.map((item, i) => (
                    <li key={i} className="text-muted-foreground">• {item.barang} — {item.jumlah}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin {confirmAction?.action === 'approve' ? 'menyetujui' : 'menolak'} permintaan ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Batal</Button>
            <Button variant={confirmAction?.action === 'reject' ? 'destructive' : 'default'} onClick={handleAction}>
              {confirmAction?.action === 'approve' ? 'Setujui' : 'Tolak'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerifikasiPage;
