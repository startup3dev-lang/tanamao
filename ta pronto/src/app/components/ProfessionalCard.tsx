import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { BadgeCheck, ChevronRight, Clock, Heart, MapPin, ShieldCheck, Sparkles, Star } from 'lucide-react';
import gsap from 'gsap';
import { type Professional } from '../data/mockData';
import { useApp } from '../context/AppContext';

interface ProfessionalCardProps {
  pro: Professional;
  featured?: boolean;
}

export function ProfessionalCard({ pro, featured = false }: ProfessionalCardProps) {
  const navigate = useNavigate();
  const { setSelectedProfessional, favorites, toggleFavorite, setShowLoginModal, setLoginIntent, isLoggedIn } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);
  const isFav = favorites.includes(pro.id);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { y: -4, scale: 1.01, duration: 0.25, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.3, ease: 'power2.inOut' });
  };

  const handleViewProfile = () => {
    setSelectedProfessional(pro);
    navigate(`/profissional/${pro.id}`);
  };

  const handleQuote = () => {
    setSelectedProfessional(pro);
    if (!isLoggedIn) {
      setLoginIntent('orcamento');
      setShowLoginModal(true);
    } else {
      navigate('/orcamento');
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`overflow-hidden rounded-2xl border bg-[#112340]/90 shadow-2xl shadow-black/15 transition-all hover:border-[#FFD100]/45 ${
        featured ? 'border-[#FFD100] ring-1 ring-[#FFD100]/40' : 'border-white/12'
      }`}
    >
      {featured && (
        <div className="flex items-center justify-center gap-2 border-b border-[#FFD100]/30 bg-[#FFD100] px-3 py-1.5 text-center text-xs font-black text-[#071327]">
          <Sparkles size={14} />
          Melhor escolha perto de você
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/15 text-lg font-black text-white"
              style={{ backgroundColor: pro.color }}
            >
              {pro.initials}
            </div>
            {pro.available && <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#112340] bg-[#34D66B]" />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold leading-tight text-white">{pro.name}</h3>
                  {pro.verified && <BadgeCheck size={15} className="shrink-0 text-white" fill="#2563EB" />}
                </div>
                <p className="text-sm text-white/65">{pro.profession}</p>
              </div>
              <button onClick={() => toggleFavorite(pro.id)} className="rounded-full p-1.5 transition-colors hover:bg-white/10">
                <Heart size={18} className={isFav ? 'text-[#FFD100]' : 'text-white/35'} fill={isFav ? '#FFD100' : 'none'} />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-[#FFD100]" fill="#FFD100" />
                <span className="text-sm font-bold text-white">{pro.rating}</span>
                <span className="text-xs text-white/45">({pro.reviews})</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-white/55">
                <MapPin size={13} className="text-white/45" />
                {pro.distance}
              </div>
              <div className="flex items-center gap-1 text-xs text-white/55">
                <Clock size={13} className="text-white/45" />
                {pro.eta}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${pro.available ? 'bg-[#1F8F46]/20 text-[#65E08A]' : 'bg-white/10 text-white/45'}`}>
            {pro.available ? 'Disponível agora' : 'Indisponível'}
          </span>
          {pro.discount && <span className="rounded-full bg-[#FFD100] px-2.5 py-1 text-xs font-black text-[#071327]">{pro.discount}</span>}
          {pro.verified && (
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/70">
              <ShieldCheck size={12} /> Verificado
            </span>
          )}
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-white/45">A partir de</p>
              <p className="text-lg font-black text-white">{pro.price.replace('A partir de ', '')}</p>
            </div>
            <p className="text-xs text-white/45">{pro.completedJobs.toLocaleString()} serviços</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleViewProfile}
              className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-white/18 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Ver perfil <ChevronRight size={15} />
            </button>
            <button
              onClick={handleQuote}
              className="flex-1 rounded-xl bg-[#FFD100] px-3 py-2 text-sm font-black text-[#071327] transition-colors hover:bg-[#FFE05C]"
            >
              Solicitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
