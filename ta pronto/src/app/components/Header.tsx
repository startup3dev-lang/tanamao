import { Link } from 'react-router';
import { BriefcaseBusiness, LogIn, MapPin, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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

  return (
    <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <LogoMark />
            <span className="text-2xl font-black tracking-tight text-[#2f2f2f]">TA PRONTO</span>
          </Link>

          {/* Location bar */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="hidden md:flex items-center gap-2 rounded-full border border-black/10 bg-[#f7f7f5] px-3 py-1.5 text-sm text-black/65 transition-all duration-200 hover:border-[#ea1d2c]/35 hover:text-black"
          >
            <MapPin size={14} className="text-[#ea1d2c]" />
            <span className="max-w-[180px] truncate">{location}</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="relative text-sm font-semibold text-black/60 transition-colors duration-200 hover:text-[#ea1d2c]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link to="/cliente" className="text-sm font-medium text-black/65 transition-colors hover:text-[#ea1d2c]">
                  Olá, {user?.name.split(' ')[0]}
                </Link>
                <button onClick={logout} className="text-sm text-black/45 transition-colors hover:text-black">
                  Sair
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-sm font-bold text-black/70 transition-colors hover:border-black/20 hover:bg-black/[0.03]"
              >
                <LogIn size={17} />
                Entrar
              </button>
            )}
            <Link
              to="/cadastro-profissional"
              className="flex items-center gap-2 rounded-xl bg-[#ea1d2c] px-4 py-2 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d91424]"
            >
              <BriefcaseBusiness size={17} />
              Seja um profissional
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-2 text-[#2f2f2f] lg:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>{mobileOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-black/5 bg-white lg:hidden">
          <div className="px-4 py-4 space-y-1">
            <button
              onClick={() => { setShowLocationModal(true); setMobileOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-black/65"
            >
              <MapPin size={14} className="text-[#ea1d2c]" />
              {location}
            </button>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-black/65 transition-colors hover:bg-[#f7f7f5] hover:text-[#ea1d2c]"
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
                className="block w-full rounded-xl bg-[#ea1d2c] px-4 py-2.5 text-center text-sm font-bold text-white"
              >
                Seja um profissional
              </Link>
            </div>
          </div>
        </motion.div>
      )}</AnimatePresence>
    </motion.header>
  );
}
