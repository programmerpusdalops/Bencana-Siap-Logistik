import { Package, PackagePlus, Truck, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { dashboardSummary, monthlyIncoming, distribusiWilayah, stokInstansi, bencanaData } from '@/data/dummyData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// BACKEND API REQUIRED
// GET /api/dashboard/summary => DashboardSummary
// GET /api/dashboard/monthly-incoming => ChartData[]
// GET /api/dashboard/distribusi-wilayah => DistribusiWilayah[]
// GET /api/dashboard/stok-instansi => StokInstansi[]
// GET /api/bencana => Bencana[]

const COLORS = ['hsl(217, 91%, 50%)', 'hsl(25, 95%, 53%)', 'hsl(142, 71%, 45%)', 'hsl(262, 83%, 58%)'];

const disasterIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Ringkasan data logistik dan bencana terkini" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Stok Logistik" value={dashboardSummary.totalStock} icon={<Package className="h-5 w-5" />} color="primary" trend="+12% dari bulan lalu" trendUp />
        <StatCard title="Total Logistik Masuk" value={dashboardSummary.totalIncoming} icon={<PackagePlus className="h-5 w-5" />} color="success" trend="+8% dari bulan lalu" trendUp />
        <StatCard title="Total Distribusi" value={dashboardSummary.totalDistributed} icon={<Truck className="h-5 w-5" />} color="accent" trend="+5% dari bulan lalu" trendUp />
        <StatCard title="Kejadian Bencana" value={dashboardSummary.disasterEvents} icon={<AlertTriangle className="h-5 w-5" />} color="destructive" trend="3 aktif" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Incoming */}
        <div className="card-dashboard">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Logistik Masuk per Bulan</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyIncoming}>
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
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={distribusiWilayah} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis type="number" fontSize={12} tick={{ fill: 'hsl(215, 14%, 46%)' }} />
              <YAxis dataKey="wilayah" type="category" fontSize={12} tick={{ fill: 'hsl(215, 14%, 46%)' }} width={80} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 20%, 90%)' }} />
              <Bar dataKey="value" fill="hsl(25, 95%, 53%)" radius={[0, 4, 4, 0]} name="Jumlah" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie + Map */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Stock by Agency */}
        <div className="card-dashboard">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Stok per Instansi</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={stokInstansi} dataKey="value" nameKey="instansi" cx="50%" cy="50%" outerRadius={100} label={({ instansi, percent }) => `${instansi} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {stokInstansi.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Mini Map */}
        <div className="card-dashboard">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Peta Bencana Terkini</h3>
          <div className="h-[280px] rounded-lg overflow-hidden">
            <MapContainer center={[-0.9, 120.5]} zoom={7} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
              {bencanaData.map(b => (
                <Marker key={b.id} position={[b.lat, b.lng]} icon={disasterIcon}>
                  <Popup>
                    <strong>{b.lokasi}</strong><br />
                    {b.jenis}<br />
                    Korban: {b.korban} | Pengungsi: {b.pengungsi}
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
