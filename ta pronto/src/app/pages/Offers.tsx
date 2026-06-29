import { useEffect, useRef, useState } from 'react';
import { Tag, Clock, Zap } from 'lucide-react';
import gsap from 'gsap';
import { professionals } from '../data/mockData';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { PageTransition } from '../components/PageTransition';

const discountPros = professionals.filter(p => p.discount);

export function Offers() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    gsap.fromTo(cardsRef.current.querySelectorAll('.offer-card'),
      { opacity: 0, y: 30, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
    );
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A1628] pt-16 pb-24">
        {/* Hero banner */}
        <div className="bg-gradient-to-r from-[#FFD100] to-[#FF9900] py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={20} className="text-[#0A1628]" />
              <span className="text-[#0A1628] font-semibold text-sm uppercase tracking-wider">Ofertas especiais</span>
            </div>
            <h1 className="text-[#0A1628] font-black text-2xl">Profissionais com desconto perto de você</h1>
            <p className="text-[#0A1628]/70 text-sm mt-1">Aproveite as promoções dos melhores profissionais da sua região.</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Urgency info */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
            {[
              { icon: <Zap size={14} />, text: 'Disponível hoje', color: 'bg-green-100 text-green-700' },
              { icon: <Clock size={14} />, text: 'Poucos horários restantes', color: 'bg-orange-100 text-orange-700' },
              { icon: <Tag size={14} />, text: 'Primeiro serviço com desconto', color: 'bg-blue-100 text-blue-700' },
            ].map((badge, i) => (
              <div key={i} className={`flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${badge.color}`}>
                {badge.icon} {badge.text}
              </div>
            ))}
          </div>

          {discountPros.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <Tag size={30} className="text-[#FFD100]" />
              </div>
              <p className="text-white/60">Sem ofertas disponíveis no momento</p>
            </div>
          ) : (
            <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {discountPros.map(pro => (
                <div key={pro.id} className="offer-card" style={{ opacity: 0 }}>
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
