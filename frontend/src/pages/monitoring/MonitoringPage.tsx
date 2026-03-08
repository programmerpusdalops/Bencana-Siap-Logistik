import { PageHeader } from '@/components/layout/PageHeader';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { bencanaData, distribusiData } from '@/data/dummyData';
import { StatusBadge } from '@/components/ui/StatusBadge';

// BACKEND API REQUIRED
// GET /api/bencana => Bencana[]
// GET /api/distribusi => Distribusi[]

const disasterIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MonitoringPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Monitoring Peta Bencana" description="Peta lokasi bencana dan distribusi logistik" />

      <div className="card-dashboard overflow-hidden p-0">
        <div className="h-[500px] md:h-[600px]">
          <MapContainer center={[-0.9, 120.5]} zoom={7} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
            {bencanaData.map(b => (
              <Marker key={b.id} position={[b.lat, b.lng]} icon={disasterIcon}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">{b.lokasi}</p>
                    <p>{b.jenis}</p>
                    <p>Korban: {b.korban}</p>
                    <p>Pengungsi: {b.pengungsi}</p>
                    <p>Status: {b.status}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {/* Distribution points as circles */}
            {bencanaData.map(b => (
              <CircleMarker key={`dist-${b.id}`} center={[b.lat + 0.02, b.lng + 0.02]} radius={8} pathOptions={{ color: 'hsl(217, 91%, 50%)', fillColor: 'hsl(217, 91%, 50%)', fillOpacity: 0.6 }}>
                <Popup>Distribusi ke {b.lokasi}</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Legend + Info Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bencanaData.map(b => (
          <div key={b.id} className="card-dashboard">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">{b.lokasi}</h3>
              <StatusBadge status={b.status} />
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Jenis: {b.jenis}</p>
              <p>Tanggal: {b.tanggal}</p>
              <p>Korban: {b.korban} | Pengungsi: {b.pengungsi}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonitoringPage;
