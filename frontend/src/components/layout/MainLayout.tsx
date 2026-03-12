import { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { TopNavbar } from './TopNavbar';
import { Menu } from 'lucide-react';

const ContentLoading = () => (
  <div className="flex flex-1 items-center justify-center py-20">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Suspense fallback={<ContentLoading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 left-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg lg:hidden"
      >
        <Menu className="h-5 w-5 text-primary-foreground" />
      </button>
    </div>
  );
};
