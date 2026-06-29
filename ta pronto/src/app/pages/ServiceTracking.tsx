import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { statusSteps } from '../data/mockData';
import { PageTransition } from '../components/PageTransition';
import { useApp } from '../context/AppContext';
import { StatusIcon } from '../components/AppIcons';

export function ServiceTracking() {
  const navigate = useNavigate();
  const { selectedProfessional } = useApp();
  const timelineRef = useRef<HTMLDivElement>(null);
  const pro = selectedProfessional;

  useEffect(() => {
    if (!timelineRef.current) return;
    const steps = timelineRef.current.querySelectorAll('.timeline-step');
    gsap.fromTo(steps,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out', delay: 0.3 }
    );

    // Animate the active progress line
    gsap.fromTo('.progress-line',
      { scaleY: 0, transformOrigin: 'top' },
      { scaleY: 1, duration: 1.2, ease: 'power3.out', delay: 0.5 }
    );
  }, []);

  const currentStep = statusSteps.filter(s => s.done).length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A1628] pt-16 pb-24">
        {/* Header */}
        <div className="bg-[#0D1F3C] border-b border-white/10 py-3 px-4 sticky top-16 z-40">
          <div className="max-w-xl mx-auto flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <ChevronLeft size={20} className="text-white" />
            </button>
            <span className="text-white font-semibold">Acompanhar serviço</span>
          </div>
        </div>

        <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
          {/* Professional info */}
          {pro && (
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0" style={{ backgroundColor: pro.color }}>
                {pro.initials}
              </div>
              <div className="flex-1">
                <p className="text-[#1A2A4A] font-bold">{pro.name}</p>
                <p className="text-gray-500 text-sm">{pro.profession}</p>
              </div>
              <button
                onClick={() => navigate('/chat')}
                className="flex items-center gap-1.5 bg-[#0A1628] text-white text-sm font-semibold px-3 py-2 rounded-xl hover:bg-[#0D1F3C] transition-colors"
              >
                <MessageCircle size={14} /> Chat
              </button>
            </div>
          )}

          {/* Status badge */}
          <div className="bg-[#FFD100]/10 border border-[#FFD100]/30 rounded-2xl p-4 text-center">
            <p className="text-[#FFD100] font-bold text-sm">Em andamento</p>
            <p className="text-white/60 text-xs mt-0.5">Aguardando confirmação do serviço</p>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-[#1A2A4A] font-bold mb-5">Status do serviço</h2>
            <div ref={timelineRef} className="relative">
              {/* Vertical line background */}
              <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gray-200" />
              {/* Progress line */}
              <div
                className="progress-line absolute left-5 top-4 w-0.5 bg-[#FFD100]"
                style={{ height: `${((currentStep - 1) / (statusSteps.length - 1)) * 100}%` }}
              />

              <div className="space-y-5">
                {statusSteps.map((step, i) => (
                  <div key={step.id} className="timeline-step flex items-start gap-4 relative" style={{ opacity: 0 }}>
                    {/* Dot */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 text-base ${
                      step.done
                        ? 'bg-[#FFD100] shadow-md'
                        : i === currentStep
                        ? 'bg-white border-2 border-[#FFD100]'
                        : 'bg-gray-100 border-2 border-gray-200'
                    }`}>
                      <StatusIcon name={step.icon} size={18} />
                    </div>
                    <div className="pt-2">
                      <p className={`text-sm font-semibold ${step.done ? 'text-[#1A2A4A]' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {step.done && <p className="text-gray-400 text-xs mt-0.5">Concluído</p>}
                      {i === currentStep && <p className="text-[#FFD100] text-xs mt-0.5 font-medium">Em andamento...</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/chat')}
              className="flex-1 border-2 border-white/20 text-white font-semibold py-3 rounded-xl hover:border-white/40 transition-colors text-sm"
            >
              Abrir chat
            </button>
            <button className="flex-1 border-2 border-red-500/30 text-red-400 font-semibold py-3 rounded-xl hover:border-red-500/50 transition-colors text-sm">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
