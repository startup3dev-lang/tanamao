import { HashRouter, Routes, Route, useLocation } from 'react-router';
import { lazy, Suspense, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { LocationModal } from './components/LocationModal';
import { LoginModal } from './components/LoginModal';
import { LoadingScreen } from './components/LoadingScreen';

const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Categories = lazy(() => import('./pages/Categories').then(module => ({ default: module.Categories })));
const Professionals = lazy(() => import('./pages/Professionals').then(module => ({ default: module.Professionals })));
const ProfessionalDetail = lazy(() => import('./pages/ProfessionalDetail').then(module => ({ default: module.ProfessionalDetail })));
const QuoteRequest = lazy(() => import('./pages/QuoteRequest').then(module => ({ default: module.QuoteRequest })));
const ServiceTracking = lazy(() => import('./pages/ServiceTracking').then(module => ({ default: module.ServiceTracking })));
const Chat = lazy(() => import('./pages/Chat').then(module => ({ default: module.Chat })));
const Rating = lazy(() => import('./pages/Rating').then(module => ({ default: module.Rating })));
const ClientArea = lazy(() => import('./pages/ClientArea').then(module => ({ default: module.ClientArea })));
const Offers = lazy(() => import('./pages/Offers').then(module => ({ default: module.Offers })));
const Favorites = lazy(() => import('./pages/Favorites').then(module => ({ default: module.Favorites })));
const ProfessionalRegister = lazy(() => import('./pages/ProfessionalRegister').then(module => ({ default: module.ProfessionalRegister })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <LocationModal />
      <LoginModal />
      <Suspense fallback={<LoadingScreen />}><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/profissionais" element={<Professionals />} />
        <Route path="/profissional/:id" element={<ProfessionalDetail />} />
        <Route path="/orcamento" element={<QuoteRequest />} />
        <Route path="/acompanhamento" element={<ServiceTracking />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/avaliacao" element={<Rating />} />
        <Route path="/cliente" element={<ClientArea />} />
        <Route path="/ofertas" element={<Offers />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/cadastro-profissional" element={<ProfessionalRegister />} />
      </Routes></Suspense>
      <MobileNav />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <div className="min-h-screen bg-[#f7f7f5]">
          <AppRoutes />
        </div>
      </AppProvider>
    </HashRouter>
  );
}
