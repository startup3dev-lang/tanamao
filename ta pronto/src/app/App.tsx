import { HashRouter, Routes, Route, useLocation } from 'react-router';
import { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { LocationModal } from './components/LocationModal';
import { LoginModal } from './components/LoginModal';

import { Home } from './pages/Home';
import { Categories } from './pages/Categories';
import { Professionals } from './pages/Professionals';
import { ProfessionalDetail } from './pages/ProfessionalDetail';
import { QuoteRequest } from './pages/QuoteRequest';
import { ServiceTracking } from './pages/ServiceTracking';
import { Chat } from './pages/Chat';
import { Rating } from './pages/Rating';
import { ClientArea } from './pages/ClientArea';
import { Offers } from './pages/Offers';
import { Favorites } from './pages/Favorites';
import { ProfessionalRegister } from './pages/ProfessionalRegister';

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
      <Routes>
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
      </Routes>
      <MobileNav />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <div className="min-h-screen bg-[#0A1628]">
          <AppRoutes />
        </div>
      </AppProvider>
    </HashRouter>
  );
}
