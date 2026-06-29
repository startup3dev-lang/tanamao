import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Star, MapPin, Clock, Heart, Settings, HelpCircle, LogOut, Briefcase, ChevronRight, Zap } from 'lucide-react';
import gsap from 'gsap';
import { professionals } from '../data/mockData';
import { PageTransition } from '../components/PageTransition';
import { useApp } from '../context/AppContext';

export function ClientArea() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, favorites, setShowLoginModal } = useApp();
  const contentRef = useRef<HTMLDivElement>(null);

  const favPros = professionals.filter(p => favorites.includes(p.id));

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(contentRef.current.querySelectorAll('.client-el'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.15 }
    );
  }, []);

  if (!isLoggedIn) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#0A1628] pt-20 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-[#FFD100]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap size={32} className="text-[#FFD100]" />
            </div>
            <h2 className="text-white font-black text-2xl mb-2">Sua área</h2>
            <p className="text-white/60 text-sm mb-6">Entre para ver seus pedidos, favoritos e histórico de serviços.</p>
            <button onClick={() => setShowLoginModal(true)} className="w-full bg-[#FFD100] text-[#0A1628] font-bold py-3.5 rounded-2xl hover:bg-[#FFDE33] transition-colors mb-3">
              Entrar
            </button>
            <button onClick={() => navigate('/')} className="text-white/50 text-sm hover:text-white transition-colors">Continuar sem entrar</button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A1628] pt-16 pb-24">
        {/* Header */}
        <div className="bg-[#0D1F3C] border-b border-white/10 py-6 px-4">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#FFD100] rounded-2xl flex items-center justify-center text-[#0A1628] font-black text-xl">
                {user?.name[0]}
              </div>
              <div>
                <h1 className="text-white font-black text-xl">Olá, {user?.name.split(' ')[0]}!</h1>
                <p className="text-white/50 text-sm">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div ref={contentRef} className="max-w-xl mx-auto px-4 py-5 space-y-4">
          {/* Active services */}
          <div className="client-el bg-white rounded-2xl p-4 shadow-sm" style={{ opacity: 0 }}>
            <h2 className="text-[#1A2A4A] font-bold text-base mb-3">Serviços em andamento</h2>
            <div
              onClick={() => navigate('/acompanhamento')}
              className="flex items-center gap-3 p-3 bg-[#FFD100]/10 border border-[#FFD100]/30 rounded-xl cursor-pointer hover:bg-[#FFD100]/15 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: '#1D4ED8' }}>
                MO
              </div>
              <div className="flex-1">
                <p className="text-[#1A2A4A] font-semibold text-sm">Marcos Oliveira – Eletricista</p>
                <p className="text-gray-500 text-xs">Orçamento enviado · Aguardando confirmação</p>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </div>

          {/* Stats */}
          <div className="client-el grid grid-cols-3 gap-3" style={{ opacity: 0 }}>
            {[
              { label: 'Serviços', value: '12', icon: <Briefcase size={18} className="text-[#FFD100]" /> },
              { label: 'Favoritos', value: String(favorites.length), icon: <Heart size={18} className="text-[#FFD100]" fill="#FFD100" /> },
              { label: 'Avaliações', value: '8', icon: <Star size={18} className="text-[#FFD100]" fill="#FFD100" /> },
            ].map((s, i) => (
              <div key={i} className="bg-[#0D1F3C] rounded-2xl p-4 text-center border border-white/10">
                <div className="flex justify-center mb-1">{s.icon}</div>
                <div className="text-white font-black text-xl">{s.value}</div>
                <div className="text-white/50 text-xs">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Favorites */}
          {favPros.length > 0 && (
            <div className="client-el bg-white rounded-2xl p-4 shadow-sm" style={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[#1A2A4A] font-bold text-base">Profissionais favoritos</h2>
                <button onClick={() => navigate('/favoritos')} className="text-[#0A1628] text-xs font-semibold">Ver todos</button>
              </div>
              <div className="space-y-3">
                {favPros.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: p.color }}>
                      {p.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-[#1A2A4A] font-semibold text-sm">{p.name}</p>
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-[#FFD100]" fill="#FFD100" />
                        <span className="text-gray-500 text-xs">{p.rating} · {p.profession}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { navigate(`/profissional/${p.id}`); }}
                      className="bg-[#FFD100] text-[#0A1628] text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#FFDE33] transition-colors"
                    >
                      Contratar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menu */}
          <div className="client-el bg-white rounded-2xl shadow-sm overflow-hidden" style={{ opacity: 0 }}>
            {[
              { icon: <MapPin size={18} className="text-gray-400" />, label: 'Endereços salvos' },
              { icon: <Star size={18} className="text-gray-400" />, label: 'Minhas avaliações' },
              { icon: <Settings size={18} className="text-gray-400" />, label: 'Configurações da conta' },
              { icon: <HelpCircle size={18} className="text-gray-400" />, label: 'Suporte' },
            ].map((item, i) => (
              <button key={i} className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                {item.icon}
                <span className="text-[#1A2A4A] text-sm font-medium flex-1 text-left">{item.label}</span>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            ))}
          </div>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="client-el w-full flex items-center justify-center gap-2 border-2 border-red-200 text-red-500 font-semibold py-3 rounded-2xl hover:bg-red-50 transition-colors" style={{ opacity: 0 }}
          >
            <LogOut size={16} /> Sair da conta
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
