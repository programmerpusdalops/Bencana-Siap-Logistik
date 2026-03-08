import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { MainLayout } from "@/components/layout/MainLayout";

const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const StokGudangPage = lazy(() => import("./pages/logistik/StokGudangPage"));
const BarangMasukPage = lazy(() => import("./pages/logistik/BarangMasukPage"));
const PermintaanPage = lazy(() => import("./pages/permintaan/PermintaanPage"));
const VerifikasiPage = lazy(() => import("./pages/permintaan/VerifikasiPage"));
const DistribusiPage = lazy(() => import("./pages/distribusi/DistribusiPage"));
const KonfirmasiPage = lazy(() => import("./pages/distribusi/KonfirmasiPage"));
const MonitoringPage = lazy(() => import("./pages/monitoring/MonitoringPage"));
const LaporanPage = lazy(() => import("./pages/laporan/LaporanPage"));
const MasterDataPage = lazy(() => import("./pages/master/MasterDataPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/stok" element={<StokGudangPage />} />
                <Route path="/barang-masuk" element={<BarangMasukPage />} />
                <Route path="/permintaan" element={<PermintaanPage />} />
                <Route path="/verifikasi" element={<VerifikasiPage />} />
                <Route path="/distribusi" element={<DistribusiPage />} />
                <Route path="/konfirmasi" element={<KonfirmasiPage />} />
                <Route path="/monitoring" element={<MonitoringPage />} />
                <Route path="/laporan" element={<LaporanPage />} />
                <Route path="/master/:type" element={<MasterDataPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
