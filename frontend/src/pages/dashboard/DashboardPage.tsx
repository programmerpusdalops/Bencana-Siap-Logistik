import { useState, useEffect } from 'react';
import { Package, PackagePlus, Truck, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { getDashboardSummary, getMonthlyIncoming, getDistribusiWilayah, getStokInstansi, getPenerimaan } from '@/services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const COLORS = ['hsl(217, 91%, 50%)', 'hsl(25, 95%, 53%)', 'hsl(142, 71%, 45%)', 'hsl(262, 83%, 58%)'];

const completedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DashboardPage = () => {
  const [summary, setSummary] = useState({ total_stock: 0, total_incoming: 0, total_distribution: 0, total_disasters: 0 });
  const [monthly, setMonthly] = useState<{ month: string; value: number }[]>([]);
  const [wilayah, setWilayah] = useState<{ wilayah: string; value: number }[]>([]);
  const [instansi, setInstansi] = useState<{ instansi: string; value: number }[]>([]);
  const [penerimaan, setPenerimaan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, m, w, i, p] = await Promise.all([
          getDashboardSummary(),
          getMonthlyIncoming(),
          getDistribusiWilayah(),
          getStokInstansi(),
          getPenerimaan(),
        ]);
        setSummary(s);
        setMonthly(m);
        setWilayah(w);
        setInstansi(i);
        setPenerimaan(p);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Ringkasan data logistik dan bencana terkini" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Stok Logistik" value={summary.total_stock} icon={<Package className="h-5 w-5" />} color="primary" />
        <StatCard title="Total Logistik Masuk" value={summary.total_incoming} icon={<PackagePlus className="h-5 w-5" />} color="success" />
        <StatCard title="Total Distribusi" value={summary.total_distribution} icon={<Truck className="h-5 w-5" />} color="accent" />
        <StatCard title="Kejadian Bencana" value={summary.total_disasters} icon={<AlertTriangle className="h-5 w-5" />} color="destructive" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Incoming */}
        <div className="card-dashboard">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Logistik Masuk per Bulan</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="month" fontSize={12} tick={{ fill: 'hsl(215, 14%, 46%)' }} />
              <YAxis fontSize={12} tick={{ fill: 'hsl(215, 14%, 46%)' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 20%, 90%)' }} />
              <Bar dataKey="value" fill="hsl(217, 91%, 50%)" radius={[4, 4, 0, 0]} name="Jumlah" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution by Region */}
        <div className="card-dashboard">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Distribusi per Wilayah</h3>
          <div className="h-[280px]">
            {wilayah.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wilayah} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                  <XAxis type="number" fontSize={12} tick={{ fill: 'hsl(215, 14%, 46%)' }} />
                  <YAxis dataKey="wilayah" type="category" fontSize={12} tick={{ fill: 'hsl(215, 14%, 46%)' }} width={80} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 20%, 90%)' }} />
                  <Bar dataKey="value" fill="hsl(25, 95%, 53%)" radius={[0, 4, 4, 0]} name="Jumlah" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">Belum ada data distribusi</div>
            )}
          </div>
        </div>
      </div>

      {/* Pie + Map */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Stock by Agency */}
        <div className="card-dashboard">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Stok per Instansi</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={instansi} dataKey="value" nameKey="instansi" cx="50%" cy="50%" outerRadius={100} label={({ instansi: name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {instansi.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Mini Map */}
        <div className="card-dashboard flex flex-col">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Titik Distribusi Terkini</h3>
          <div className="flex-1 min-h-[280px] rounded-lg overflow-hidden border border-border">
            <MapContainer center={[-0.9, 120.5]} zoom={7} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
              {penerimaan.filter((p: any) => p.latitude && p.longitude).map((p: any) => (
                <Marker key={p.id} position={[p.latitude, p.longitude]} icon={completedIcon}>
                  <Popup>
                    <div className="text-sm">
                      <strong>DIST-{String(p.distribusi?.id).padStart(3, '0')}</strong><br />
                      Tujuan: {p.distribusi?.permintaan?.bencana?.lokasi || '-'}<br />
                      Diterima oleh: {p.petugas_posko}<br />
                      Tanggal: {new Date(p.tanggal_terima).toLocaleDateString('id-ID')}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
