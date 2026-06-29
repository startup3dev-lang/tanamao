import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Heart } from 'lucide-react';
import gsap from 'gsap';
import { professionals } from '../data/mockData';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { PageTransition } from '../components/PageTransition';
import { useApp } from '../context/AppContext';

export function Favorites() {
  const navigate = useNavigate();
  const { favorites } = useApp();
  const favPros = professionals.filter(p => favorites.includes(p.id));
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    gsap.fromTo(cardsRef.current.querySelectorAll('.fav-card'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.1 }
    );
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A1628] pt-16 pb-24">
        <div className="bg-[#0D1F3C] border-b border-white/10 py-6 px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-white font-black text-2xl">Profissionais favoritos</h1>
            <p className="text-white/50 text-sm mt-1">{favPros.length} profissionais salvos</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6">
          {favPros.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={48} className="text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg font-medium">Nenhum favorito ainda</p>
              <p className="text-white/40 text-sm mt-2 mb-6">Salve os profissionais que você mais gosta para acessar rapidamente.</p>
              <button onClick={() => navigate('/profissionais')} className="bg-[#FFD100] text-[#0A1628] font-bold px-6 py-3 rounded-2xl hover:bg-[#FFDE33] transition-colors">
                Explorar profissionais
              </button>
            </div>
          ) : (
            <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favPros.map(pro => (
                <div key={pro.id} className="fav-card" style={{ opacity: 0 }}>
                  <ProfessionalCard pro={pro} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
