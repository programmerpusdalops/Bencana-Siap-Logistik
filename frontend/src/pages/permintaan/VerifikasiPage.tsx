import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { getPermintaan, approvePermintaan, rejectPermintaan } from '@/services/api';

const VerifikasiPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: number; action: 'approve' | 'reject' } | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getPermintaan();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAction = async () => {
    if (!confirmAction) return;
    setProcessing(true);
    try {
      if (confirmAction.action === 'approve') {
        await approvePermintaan(confirmAction.id);
        toast.success('Permintaan disetujui!');
      } else {
        await rejectPermintaan(confirmAction.id);
        toast.success('Permintaan ditolak!');
      }
      setConfirmAction(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal memproses');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Verifikasi Permintaan" description="Verifikasi dan setujui permintaan logistik bencana" />

      <div className="card-dashboard overflow-hidden p-0">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-4 py-8 text-center text-muted-foreground">Memuat data...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Lokasi</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Jenis Bencana</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Pemohon</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p: any) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">REQ-{String(p.id).padStart(3, '0')}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.bencana?.lokasi}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.bencana?.jenis_bencana}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{new Date(p.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.pemohon?.name}</td>
                    <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={() => setSelected(p)}>
                          <Eye className="h-3 w-3 mr-1" />Detail
                        </Button>
                        {p.status === 'pending' && (
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
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Permintaan REQ-{String(selected?.id).padStart(3, '0')}</DialogTitle>
            <DialogDescription>Informasi lengkap permintaan logistik</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Lokasi:</span> <span className="font-medium text-foreground">{selected.bencana?.lokasi}</span></div>
                <div><span className="text-muted-foreground">Jenis:</span> <span className="font-medium text-foreground">{selected.bencana?.jenis_bencana}</span></div>
                <div><span className="text-muted-foreground">Korban:</span> <span className="font-medium text-foreground">{selected.bencana?.jumlah_korban}</span></div>
                <div><span className="text-muted-foreground">Pengungsi:</span> <span className="font-medium text-foreground">{selected.bencana?.jumlah_pengungsi}</span></div>
                <div><span className="text-muted-foreground">Pemohon:</span> <span className="font-medium text-foreground">{selected.pemohon?.name}</span></div>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Barang diminta:</p>
                <ul className="space-y-1">
                  {selected.detail?.map((item: any, i: number) => (
                    <li key={i} className="text-muted-foreground">• {item.barang?.nama_barang} — {item.jumlah} {item.barang?.satuan?.nama_satuan}</li>
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
            <Button variant="outline" onClick={() => setConfirmAction(null)} disabled={processing}>Batal</Button>
            <Button variant={confirmAction?.action === 'reject' ? 'destructive' : 'default'} onClick={handleAction} disabled={processing}>
              {processing ? 'Memproses...' : confirmAction?.action === 'approve' ? 'Setujui' : 'Tolak'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerifikasiPage;
