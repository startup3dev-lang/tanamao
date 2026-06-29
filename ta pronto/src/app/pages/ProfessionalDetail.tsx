import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Star, MapPin, Clock, CheckCircle, Heart, ChevronLeft, Shield, Briefcase, MessageCircle, Calendar, LockKeyhole, Wrench } from 'lucide-react';
import gsap from 'gsap';
import { professionals, reviews } from '../data/mockData';
import { PageTransition } from '../components/PageTransition';
import { useApp } from '../context/AppContext';

export function ProfessionalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedProfessional, favorites, toggleFavorite, setShowLoginModal, setLoginIntent, isLoggedIn } = useApp();
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const pro = professionals.find(p => p.id === Number(id)) || professionals[0];
  const isFav = favorites.includes(pro.id);

  useEffect(() => {
    setSelectedProfessional(pro);
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
    gsap.fromTo(contentRef.current?.querySelectorAll('.detail-el') ?? [],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
    );
  }, [pro]);

  const handleAction = (intent: string, path: string) => {
    setSelectedProfessional(pro);
    if (!isLoggedIn) {
      setLoginIntent(intent);
      setShowLoginModal(true);
    } else {
      navigate(path);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A1628] pt-16 pb-32 md:pb-8">
        {/* Back button */}
        <div ref={headerRef} className="bg-[#0D1F3C] border-b border-white/10 py-3 px-4 sticky top-16 z-40" style={{ opacity: 0 }}>
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <ChevronLeft size={20} className="text-white" />
            </button>
            <span className="text-white font-semibold">{pro.name}</span>
          </div>
        </div>

        <div ref={contentRef} className="max-w-4xl mx-auto px-4 py-6 space-y-5">
          {/* Profile card */}
          <div className="detail-el bg-white rounded-2xl p-6 shadow-lg" style={{ opacity: 0 }}>
            <div className="flex items-start gap-4">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0"
                style={{ backgroundColor: pro.color }}
              >
                {pro.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-[#1A2A4A] font-black text-xl">{pro.name}</h1>
                      {pro.verified && <CheckCircle size={16} className="text-blue-500" fill="#3B82F6" />}
                    </div>
                    <p className="text-gray-500 font-medium">{pro.profession}</p>
                  </div>
                  <button onClick={() => toggleFavorite(pro.id)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Heart size={22} className={isFav ? 'text-red-500' : 'text-gray-300'} fill={isFav ? '#EF4444' : 'none'} />
                  </button>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Star size={15} className="text-[#FFD100]" fill="#FFD100" />
                    <span className="text-[#1A2A4A] font-bold">{pro.rating}</span>
                    <span className="text-gray-400 text-sm">({pro.reviews} avaliações)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin size={14} /> {pro.distance}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock size={14} /> Responde em {pro.responseTime}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Briefcase size={14} /> {pro.completedJobs.toLocaleString()} serviços
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${pro.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                <span className={`mr-1 inline-block h-2 w-2 rounded-full ${pro.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                {pro.available ? 'Disponível hoje' : 'Indisponível'}
              </span>
              {pro.verified && (
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 flex items-center gap-1">
                  <Shield size={11} /> Profissional verificado
                </span>
              )}
              {pro.discount && (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#FFD100] text-[#0A1628]">
                  {pro.discount}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-gray-500 text-sm">Faixa de preço: </span>
              <span className="text-[#1A2A4A] font-bold">{pro.priceRange}</span>
            </div>
          </div>

          {/* Fake gallery */}
          <div className="detail-el" style={{ opacity: 0 }}>
            <h2 className="text-white font-bold text-lg mb-3">Portfólio de trabalhos</h2>
            <div className="grid grid-cols-3 gap-2">
              {['#1D4ED8','#059669','#7C3AED'].map((color, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden" style={{ backgroundColor: color }}>
                  <div className="w-full h-full flex items-center justify-center opacity-30">
                    <Wrench size={34} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="detail-el bg-white rounded-2xl p-5 shadow-sm" style={{ opacity: 0 }}>
            <h2 className="text-[#1A2A4A] font-bold text-base mb-2">Sobre o profissional</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{pro.bio}</p>
          </div>

          {/* Services */}
          <div className="detail-el bg-white rounded-2xl p-5 shadow-sm" style={{ opacity: 0 }}>
            <h2 className="text-[#1A2A4A] font-bold text-base mb-3">Serviços oferecidos</h2>
            <div className="flex flex-wrap gap-2">
              {pro.services.map((svc, i) => (
                <span key={i} className="bg-gray-100 text-[#1A2A4A] text-sm px-3 py-1.5 rounded-full">
                  {svc}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="detail-el" style={{ opacity: 0 }}>
            <h2 className="text-white font-bold text-lg mb-3">Avaliações dos clientes</h2>
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                        {r.author[0]}
                      </div>
                      <span className="text-[#1A2A4A] font-semibold text-sm">{r.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={12} className="text-[#FFD100]" fill="#FFD100" />
                      ))}
                      <span className="text-gray-400 text-xs ml-1">{r.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Login notice */}
          <div className="detail-el bg-[#FFD100]/10 border border-[#FFD100]/30 rounded-2xl p-4 text-center" style={{ opacity: 0 }}>
            <p className="text-white/70 text-sm">
              <LockKeyhole size={15} className="inline text-[#FFD100]" /> Você só precisa fazer login para confirmar a solicitação.
            </p>
          </div>
        </div>

        {/* Fixed bottom action bar */}
        <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto bg-[#0D1F3C] md:bg-transparent border-t border-white/10 md:border-0 p-4 z-50">
          <div className="max-w-4xl mx-auto flex gap-3">
            <button
              onClick={() => handleAction('chat', '/chat')}
              className="flex items-center gap-2 border-2 border-white/20 text-white font-semibold px-4 py-3 rounded-xl hover:border-white/40 hover:bg-white/5 transition-all text-sm"
            >
              <MessageCircle size={16} /> Conversar
            </button>
            <button
              onClick={() => handleAction('agenda', '/acompanhamento')}
              className="flex items-center gap-2 border-2 border-white/20 text-white font-semibold px-4 py-3 rounded-xl hover:border-white/40 hover:bg-white/5 transition-all text-sm"
            >
              <Calendar size={16} /> Agendar
            </button>
            <button
              onClick={() => handleAction('orcamento', '/orcamento')}
              className="flex-1 bg-[#FFD100] text-[#0A1628] font-bold px-4 py-3 rounded-xl hover:bg-[#FFDE33] transition-colors text-sm"
            >
              Solicitar orçamento
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
