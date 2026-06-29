import { Link, useNavigate } from 'react-router';
import { BriefcaseBusiness, LogIn, MapPin, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useApp } from '../context/AppContext';
import { LogoMark } from './AppIcons';

const navLinks = [
  { label: 'Início', to: '/' },
  { label: 'Categorias', to: '/categorias' },
  { label: 'Profissionais', to: '/profissionais' },
  { label: 'Ofertas', to: '/ofertas' },
  { label: 'Como funciona', to: '/#como-funciona' },
];

export function Header() {
  const { location, isLoggedIn, user, logout, setShowLoginModal, setShowLocationModal } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, []);

  return (
    <header ref={headerRef} style={{ opacity: 0 }} className="fixed top-0 left-0 right-0 z-50 bg-[#0A1628]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <LogoMark />
            <span className="text-2xl font-black tracking-tight text-white">TA PRONTO</span>
          </Link>

          {/* Location bar */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 text-white/80 text-sm hover:border-[#FFD100]/50 hover:text-white transition-all duration-200"
          >
            <MapPin size={14} className="text-[#FFD100]" />
            <span className="max-w-[180px] truncate">{location}</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="relative text-sm font-semibold text-white/75 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link to="/cliente" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
                  Olá, {user?.name.split(' ')[0]}
                </Link>
                <button onClick={logout} className="text-white/50 hover:text-white text-sm transition-colors">
                  Sair
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 rounded-xl border border-white/18 px-4 py-2 text-sm font-bold text-white/90 transition-colors hover:border-white/35 hover:bg-white/5"
              >
                <LogIn size={17} />
                Entrar
              </button>
            )}
            <Link
              to="/cadastro-profissional"
              className="flex items-center gap-2 rounded-xl bg-[#FFD100] px-4 py-2 text-sm font-black text-[#071327] transition-colors duration-200 hover:bg-[#FFE05C]"
            >
              <BriefcaseBusiness size={17} />
              Seja um profissional
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0D1F3C] border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            <button
              onClick={() => { setShowLocationModal(true); setMobileOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-white/80 text-sm"
            >
              <MapPin size={14} className="text-[#FFD100]" />
              {location}
            </button>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-white/70 hover:text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              {isLoggedIn ? (
                <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left px-3 py-2.5 text-white/70 text-sm">
                  Sair
                </button>
              ) : (
                <button onClick={() => { setShowLoginModal(true); setMobileOpen(false); }} className="w-full text-left px-3 py-2.5 text-white/70 text-sm">
                  Entrar
                </button>
              )}
              <Link
                to="/cadastro-profissional"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-[#FFD100] text-[#0A1628] text-sm font-bold px-4 py-2.5 rounded-xl"
              >
                Seja um profissional
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
