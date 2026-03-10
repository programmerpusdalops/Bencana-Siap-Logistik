import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, PackagePlus, FileText, CheckCircle,
  Truck, ClipboardCheck, Map, BarChart3, Database, X, Shield,
  ChevronDown, Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';
import { useState } from 'react';

interface MenuItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  roles: UserRole[];
  children?: { label: string; path: string; roles: UserRole[] }[];
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['super_admin', 'admin_gudang', 'admin_pusdalops', 'petugas_posko', 'pimpinan'] },
  { label: 'Manajemen User', icon: Users, path: '/users', roles: ['super_admin'] },
  { label: 'Stok Gudang', icon: Package, path: '/stok', roles: ['super_admin', 'admin_gudang', 'pimpinan'] },
  { label: 'Barang Masuk', icon: PackagePlus, path: '/barang-masuk', roles: ['super_admin', 'admin_gudang'] },
  { label: 'Permintaan Logistik', icon: FileText, path: '/permintaan', roles: ['super_admin', 'admin_pusdalops', 'petugas_posko'] },
  { label: 'Verifikasi', icon: CheckCircle, path: '/verifikasi', roles: ['super_admin', 'admin_pusdalops'] },
  { label: 'Distribusi', icon: Truck, path: '/distribusi', roles: ['super_admin', 'admin_gudang', 'admin_pusdalops'] },
  { label: 'Konfirmasi', icon: ClipboardCheck, path: '/konfirmasi', roles: ['super_admin', 'petugas_posko'] },
  { label: 'Monitoring Peta', icon: Map, path: '/monitoring', roles: ['super_admin', 'admin_pusdalops', 'pimpinan'] },
  { label: 'Laporan', icon: BarChart3, path: '/laporan', roles: ['super_admin', 'pimpinan', 'admin_pusdalops'] },
  {
    label: 'Master Data', icon: Database, roles: ['super_admin'],
    children: [
      { label: 'Jenis Logistik', path: '/master/jenis-logistik', roles: ['super_admin'] },
      { label: 'Barang Logistik', path: '/master/barang-logistik', roles: ['super_admin'] },
      { label: 'Gudang', path: '/master/gudang', roles: ['super_admin'] },
      { label: 'Instansi', path: '/master/instansi', roles: ['super_admin'] },
      { label: 'Satuan', path: '/master/satuan', roles: ['super_admin'] },
      { label: 'Kendaraan', path: '/master/kendaraan', roles: ['super_admin'] },
    ],
  },
];

const roleLabels: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin_gudang: 'Admin Gudang',
  admin_pusdalops: 'Admin Pusdalops',
  petugas_posko: 'Petugas Posko',
  pimpinan: 'Pimpinan',
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AppSidebar = ({ open, onClose }: Props) => {
  const location = useLocation();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Master Data']);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const filteredItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-sidebar-primary" />
          <div>
            <h1 className="text-sm font-bold leading-tight text-sidebar-foreground">Siap Logistik</h1>
            <p className="text-[10px] text-sidebar-muted">Bencana</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-sidebar-muted hover:text-sidebar-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            if (item.children) {
              const isExpanded = expandedMenus.includes(item.label);
              const isChildActive = item.children.some(c => location.pathname === c.path);
              return (
                <li key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-sidebar-accent ${isChildActive ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground'
                      }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <ul className="mt-1 ml-4 space-y-1 border-l border-sidebar-border pl-3">
                      {item.children.filter(c => c.roles.includes(user.role)).map(child => (
                        <li key={child.path}>
                          <Link
                            to={child.path}
                            onClick={onClose}
                            className={`block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent ${location.pathname === child.path
                              ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                              : 'text-sidebar-foreground'
                              }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path!}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-sidebar-accent ${isActive
                    ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                    : 'text-sidebar-foreground'
                    }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info at bottom */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</p>
            <p className="text-xs text-sidebar-muted">{roleLabels[user.role]}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
