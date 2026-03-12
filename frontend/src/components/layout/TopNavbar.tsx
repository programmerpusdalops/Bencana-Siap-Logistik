import { Bell, LogOut, ChevronRight, Menu, User as UserIcon } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

import { useState, useRef, useEffect } from 'react';
import type { UserRole } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const roleLabels: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin_gudang: 'Admin Gudang',
  admin_pusdalops: 'Admin Pusdalops',
  petugas_posko: 'Petugas Posko',
  pimpinan: 'Pimpinan',
};

const breadcrumbMap: Record<string, string> = {
  '/': 'Dashboard',
  '/users': 'Manajemen User',
  '/stok': 'Stok Gudang',
  '/barang-masuk': 'Barang Masuk',
  '/permintaan': 'Permintaan Logistik',
  '/verifikasi': 'Verifikasi Permintaan',
  '/distribusi': 'Distribusi Logistik',
  '/konfirmasi': 'Konfirmasi Penerimaan',
  '/monitoring': 'Monitoring Peta',
  '/laporan': 'Laporan',
  '/master/jenis-logistik': 'Jenis Logistik',
  '/master/barang-logistik': 'Barang Logistik',
  '/master/gudang': 'Gudang',
  '/master/instansi': 'Instansi',
  '/master/satuan': 'Satuan',
  '/master/kendaraan': 'Kendaraan',
};

interface Props {
  onMenuClick: () => void;
}

export const TopNavbar = ({ onMenuClick }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const notifications: { id: number; title: string; message: string; time: string; read: boolean; type: 'info' | 'warning' | 'success' | 'error' }[] = [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const currentPage = breadcrumbMap[location.pathname] || 'Halaman';
  const isMaster = location.pathname.startsWith('/master');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6" style={{ boxShadow: 'var(--shadow-soft)' }}>
      {/* Left: menu + breadcrumb */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-muted-foreground hover:text-foreground">
          <Menu className="h-5 w-5" />
        </button>
        <nav className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
          <Link to="/" className="hover:text-foreground">Home</Link>
          {isMaster && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span>Master Data</span>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">{currentPage}</span>
        </nav>
        <span className="text-sm font-medium text-foreground sm:hidden">{currentPage}</span>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card p-0 shadow-lg z-50 animate-fade-in">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">Notifikasi</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? notifications.map(n => (
                  <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-border last:border-0 ${!n.read ? 'bg-primary/5' : ''}`}>
                    <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${n.type === 'warning' ? 'bg-warning' : n.type === 'error' ? 'bg-destructive' : n.type === 'success' ? 'bg-success' : 'bg-primary'}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                    </div>
                  </div>
                )) : (
                  <div className="px-4 py-6 text-center text-xs text-muted-foreground">Tidak ada notifikasi</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors outline-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
              <p className="text-[10px] text-muted-foreground">{roleLabels[user.role] || user.role}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              {roleLabels[user.role] || user.role}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
