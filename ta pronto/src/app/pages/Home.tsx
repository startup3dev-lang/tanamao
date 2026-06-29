import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Search, ArrowRight, Star, Navigation, CheckCircle, Zap, Shield, Clock, Tag } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categories, professionals } from '../data/mockData';
import { CategoryCard } from '../components/CategoryCard';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { useApp } from '../context/AppContext';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const navigate = useNavigate();
  const { location, setShowLocationModal } = useApp();
  const [searchValue, setSearchValue] = useState('');
  const heroRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const profRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance stagger
      gsap.fromTo('.hero-el',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
      );

      // Categories on scroll
      gsap.fromTo('.cat-card',
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: categoriesRef.current, start: 'top 82%' }
        }
      );

      // Professional cards on scroll
      gsap.fromTo('.pro-card',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: profRef.current, start: 'top 82%' }
        }
      );

      // Steps on scroll
      gsap.fromTo('.step-el',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.55, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: stepsRef.current, start: 'top 82%' }
        }
      );

      // Stats counter animation
      gsap.fromTo('.stat-el',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.stats-section', start: 'top 85%' }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/profissionais?busca=${encodeURIComponent(searchValue)}`);
    } else {
      navigate('/profissionais');
    }
  };

  const availablePros = professionals.filter(p => p.available);
  const discountPros = professionals.filter(p => p.discount);

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* HERO */}
      <section ref={heroRef} className="relative pt-28 pb-16 px-4 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute right-0 top-20 hidden h-80 w-1/2 opacity-30 lg:block bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:42px_42px] [transform:perspective(700px)_rotateX(58deg)]" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="hero-el inline-flex items-center gap-2 bg-[#FFD100]/10 border border-[#FFD100]/30 text-[#FFD100] text-sm font-semibold px-4 py-2 rounded-full mb-6" style={{ opacity: 0 }}>
            <Zap size={14} fill="#FFD100" />
            Profissionais verificados e disponíveis agora
          </div>

          <h1 className="hero-el text-white font-black leading-tight mb-4" style={{ opacity: 0, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Localize o profissional que<br />
            <span className="text-[#FFD100]">você precisa</span> mais próximo de você.
          </h1>

          <p className="hero-el text-white/60 mb-8 max-w-xl mx-auto leading-relaxed" style={{ opacity: 0, fontSize: '1.05rem' }}>
            Pedreiro, eletricista, encanador, pintor, diarista e outros profissionais prontos para te atender em poucos cliques.
          </p>

          {/* Search box */}
          <div className="hero-el bg-white rounded-2xl p-2 flex gap-2 max-w-xl mx-auto shadow-2xl mb-4" style={{ opacity: 0 }}>
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Digite seu endereço ou use sua localização atual"
                className="flex-1 text-[#1A2A4A] text-sm outline-none placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#FFD100] text-[#0A1628] font-bold px-5 py-3 rounded-xl hover:bg-[#FFDE33] transition-colors shrink-0 text-sm"
            >
              Buscar profissionais
            </button>
          </div>

          {/* Location */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="hero-el inline-flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors" style={{ opacity: 0 }}
          >
            <Navigation size={14} className="text-[#FFD100]" />
            <span>Buscando em: <span className="text-white font-medium">{location}</span></span>
            <span className="text-[#FFD100] underline">Alterar</span>
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section bg-[#0D1F3C] py-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '47.000+', label: 'Profissionais' },
              { value: '4.8/5', label: 'Avaliação média' },
              { value: '98%', label: 'Satisfação' },
              { value: '15 min', label: 'Tempo médio' },
            ].map((s, i) => (
              <div key={i} className="stat-el" style={{ opacity: 0 }}>
                <div className="text-[#FFD100] font-black text-2xl">{s.value}</div>
                <div className="text-white/50 text-sm mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-white font-black text-2xl">Categorias de serviços</h2>
              <p className="text-white/50 text-sm mt-1">Encontre o profissional ideal para cada necessidade</p>
            </div>
            <button onClick={() => navigate('/categorias')} className="hidden sm:flex items-center gap-1.5 text-[#FFD100] text-sm font-semibold hover:gap-2.5 transition-all">
              Ver todas <ArrowRight size={16} />
            </button>
          </div>
          <div ref={categoriesRef} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {categories.slice(0, 12).map(cat => (
              <div key={cat.id} className="cat-card" style={{ opacity: 0 }}>
                <CategoryCard category={cat} />
              </div>
            ))}
          </div>
          <div className="mt-4 text-center sm:hidden">
            <button onClick={() => navigate('/categorias')} className="text-[#FFD100] text-sm font-semibold">
              Ver todas as categorias
            </button>
          </div>
        </div>
      </section>

      {/* PROFESSIONALS NEARBY */}
      <section className="py-10 px-4 bg-[#0D1F3C]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-white font-black text-2xl">Profissionais próximos</h2>
              <p className="text-white/50 text-sm mt-1">Disponíveis agora perto de você</p>
            </div>
            <button onClick={() => navigate('/profissionais')} className="hidden sm:flex items-center gap-1.5 text-[#FFD100] text-sm font-semibold hover:gap-2.5 transition-all">
              Ver todos <ArrowRight size={16} />
            </button>
          </div>
          <div ref={profRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePros.slice(0, 3).map((pro, i) => (
              <div key={pro.id} className="pro-card" style={{ opacity: 0 }}>
                <ProfessionalCard pro={pro} featured={i === 0} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCOUNTS */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="flex items-center gap-2 text-white font-black text-2xl"><Tag size={24} className="text-[#FFD100]" /> Profissionais com desconto</h2>
              <p className="text-white/50 text-sm mt-1">Ofertas especiais perto de você</p>
            </div>
            <button onClick={() => navigate('/ofertas')} className="hidden sm:flex items-center gap-1.5 text-[#FFD100] text-sm font-semibold hover:gap-2.5 transition-all">
              Ver todas <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {discountPros.map(pro => (
              <ProfessionalCard key={pro.id} pro={pro} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="py-14 px-4 bg-[#0D1F3C]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-white font-black text-2xl">Como funciona</h2>
            <p className="text-white/50 mt-2">Em 3 passos simples você contrata o profissional ideal</p>
          </div>
          <div ref={stepsRef} className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: <MapPin size={28} className="text-[#FFD100]" />, title: 'Informe sua localização', desc: 'Digite seu endereço ou use a localização automática para encontrar profissionais próximos.' },
              { step: '02', icon: <Search size={28} className="text-[#FFD100]" />, title: 'Escolha o profissional', desc: 'Compare avaliações, preços e disponibilidade. Veja perfis completos e portfólios.' },
              { step: '03', icon: <CheckCircle size={28} className="text-[#FFD100]" />, title: 'Agende ou solicite', desc: 'Solicite orçamento, converse no chat e acompanhe o serviço em tempo real.' },
            ].map((item, i) => (
              <div key={i} className="step-el bg-[#0A1628] rounded-2xl p-6 border border-white/10 relative" style={{ opacity: 0 }}>
                <div className="absolute top-4 right-4 text-white/10 font-black text-4xl">{item.step}</div>
                <div className="w-14 h-14 bg-[#FFD100]/10 rounded-2xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-white font-black text-2xl text-center mb-10">Por que escolher o TA PRONTO?</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { icon: <Shield size={22} className="text-[#FFD100]" />, title: 'Profissionais verificados', desc: 'Todos passam por análise de documentos e histórico.' },
              { icon: <Star size={22} className="text-[#FFD100]" fill="#FFD100" />, title: 'Avaliações reais', desc: 'Avaliações de clientes reais após cada serviço concluído.' },
              { icon: <Clock size={22} className="text-[#FFD100]" />, title: 'Atendimento rápido', desc: 'Profissionais disponíveis agora com resposta em minutos.' },
            ].map((item, i) => (
              <div key={i} className="bg-[#0D1F3C] rounded-2xl p-5 border border-white/10">
                <div className="w-10 h-10 bg-[#FFD100]/10 rounded-xl flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold text-base mb-1">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-[#FFD100]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[#0A1628] font-black text-2xl mb-3">É profissional? Ganhe mais com o TA PRONTO</h2>
          <p className="text-[#0A1628]/70 mb-6">Receba pedidos de clientes próximos, defina sua agenda e aumente sua renda.</p>
          <button
            onClick={() => navigate('/cadastro-profissional')}
            className="bg-[#0A1628] text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-[#0D1F3C] transition-colors text-sm"
          >
            Começar agora - é grátis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#060E1E] py-10 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#FFD100] rounded-lg flex items-center justify-center">
                <Zap size={13} className="text-[#0A1628]" fill="#0A1628" />
              </div>
              <span className="text-white font-black text-lg">TA PRONTO</span>
            </div>
            <p className="text-white/30 text-sm">2026 TA PRONTO. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
