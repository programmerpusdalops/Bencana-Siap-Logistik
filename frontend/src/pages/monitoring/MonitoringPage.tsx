import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Truck, CheckCircle, Package, MapPin } from 'lucide-react';
import { getDistribusi, getPenerimaan } from '@/services/api';

// ─── Custom marker icons ────────────────────────────────────────────────────────
const completedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const pendingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MonitoringPage = () => {
  const [distribusi, setDistribusi] = useState<any[]>([]);
  const [penerimaan, setPenerimaan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [d, p] = await Promise.all([getDistribusi(), getPenerimaan()]);
        setDistribusi(d);
        setPenerimaan(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ─── Stats ──────────────────────────────────────────────────────────────────────
  const totalDistribusi = distribusi.length;
  const sedangDikirim = distribusi.filter(d => d.status === 'pending' || d.status === 'on_delivery').length;
  const selesaiDikirim = distribusi.filter(d => d.status === 'completed' || d.status === 'delivered').length;
  const totalItemDisalurkan = distribusi.reduce((sum, d) => {
    return sum + (d.detail?.reduce((s: number, item: any) => s + item.jumlah, 0) || 0);
  }, 0);

  // Only show markers for penerimaan with coordinates
  const markers = penerimaan.filter((p: any) => p.latitude && p.longitude);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Monitoring Distribusi" description="Pemantauan titik penyaluran logistik bencana secara real-time" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card-dashboard flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalDistribusi}</p>
            <p className="text-xs text-muted-foreground">Total Distribusi</p>
          </div>
        </div>
        <div className="card-dashboard flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{sedangDikirim}</p>
            <p className="text-xs text-muted-foreground">Sedang Dikirim</p>
          </div>
        </div>
        <div className="card-dashboard flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{selesaiDikirim}</p>
            <p className="text-xs text-muted-foreground">Selesai Diterima</p>
          </div>
        </div>
        <div className="card-dashboard flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalItemDisalurkan.toLocaleString('id-ID')}</p>
            <p className="text-xs text-muted-foreground">Total Item Disalurkan</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="card-dashboard">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Peta Distribusi Logistik</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-green-500 inline-block"></span> Diterima</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-orange-400 inline-block"></span> Dalam Proses</span>
          </div>
        </div>
        <div className="h-[500px] rounded-lg overflow-hidden border border-border">
          <MapContainer center={[-0.9, 120.5] as L.LatLngExpression} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {markers.map((p: any) => {
              const dist = p.distribusi;
              const isCompleted = dist?.status === 'completed';
              return (
                <Marker
                  key={p.id}
                  position={[p.latitude, p.longitude] as L.LatLngExpression}
                  icon={isCompleted ? completedIcon : pendingIcon}
                >
                  <Popup maxWidth={320}>
                    <div className="text-sm space-y-1.5 min-w-[220px]">
                      <div className="font-bold text-base border-b pb-1 mb-1">
                        DIST-{String(dist?.id).padStart(3, '0')}
                      </div>
                      <div><span className="text-gray-500">Tujuan:</span> <strong>{dist?.permintaan?.bencana?.lokasi || '-'}</strong></div>
                      <div><span className="text-gray-500">Gudang Asal:</span> {dist?.gudang?.nama_gudang}</div>
                      <div><span className="text-gray-500">Kendaraan:</span> {dist?.kendaraan?.nama_kendaraan}</div>
                      <div><span className="text-gray-500">Petugas Kirim:</span> {dist?.petugas?.name}</div>
                      <div><span className="text-gray-500">Petugas Terima:</span> {p.petugas_posko}</div>
                      <div><span className="text-gray-500">Tgl Terima:</span> {new Date(p.tanggal_terima).toLocaleDateString('id-ID')}</div>
                      <div>
                        <span className="text-gray-500">Status:</span>{' '}
                        <span className={`font-semibold ${isCompleted ? 'text-green-600' : 'text-orange-500'}`}>
                          {dist?.status === 'completed' ? '✅ Diterima' : '🕐 ' + dist?.status}
                        </span>
                      </div>
                      {p.catatan && (
                        <div className="text-xs text-gray-500 italic border-t pt-1 mt-1">"{p.catatan}"</div>
                      )}
                      <div className="border-t pt-1 mt-1">
                        <span className="text-gray-500 text-xs">Barang:</span>
                        <ul className="text-xs mt-0.5">
                          {dist?.detail?.map((item: any, idx: number) => (
                            <li key={idx}>• {item.barang?.nama_barang} — {item.jumlah} {item.barang?.satuan?.nama_satuan}</li>
                          ))}
                        </ul>
                      </div>
                      {p.dokumentasi && (
                        <div className="border-t pt-1 mt-1">
                          <a href={p.dokumentasi} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                            📷 Lihat Foto Dokumentasi
                          </a>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
        {markers.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            <MapPin className="h-5 w-5 mx-auto mb-1 text-muted-foreground/50" />
            Belum ada data penerimaan dengan lokasi koordinat.
          </div>
        )}
      </div>

      {/* Distribution Table */}
      <div className="card-dashboard overflow-hidden p-0">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Daftar Distribusi Logistik</h3>
        </div>
        <div className="overflow-x-auto">
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
              {distribusi.map((d: any) => (
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
                      d.status === 'completed' ? 'bg-success/10 text-success'
                      : d.status === 'delivered' ? 'bg-primary/10 text-primary'
                      : d.status === 'on_delivery' ? 'bg-warning/10 text-warning'
                      : 'bg-muted text-muted-foreground'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;
