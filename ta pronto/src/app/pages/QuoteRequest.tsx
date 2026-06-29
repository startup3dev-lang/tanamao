import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Camera, CheckCircle, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { PageTransition } from '../components/PageTransition';
import { useApp } from '../context/AppContext';

const urgencyOptions = [
  { id: 'hoje', label: 'Hoje', desc: 'Urgente' },
  { id: 'amanha', label: 'Amanhã', desc: 'Próximo dia' },
  { id: 'semana', label: 'Esta semana', desc: 'Até 7 dias' },
  { id: 'data', label: 'Data personalizada', desc: 'Escolher data' },
];

export function QuoteRequest() {
  const navigate = useNavigate();
  const { selectedProfessional, location } = useApp();
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('hoje');
  const [submitted, setSubmitted] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const pro = selectedProfessional;

  const handleSubmit = () => {
    if (!description.trim()) return;
    gsap.to(formRef.current, { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in', onComplete: () => {
      setSubmitted(true);
      setTimeout(() => {
        gsap.fromTo(successRef.current,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.7)' }
        );
      }, 50);
    }});
  };

  if (submitted) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#0A1628] pt-20 flex items-center justify-center px-4">
          <div ref={successRef} className="text-center max-w-sm" style={{ opacity: 0 }}>
            <div className="w-20 h-20 bg-[#FFD100] rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={36} className="text-[#0A1628]" />
            </div>
            <h2 className="text-white font-black text-2xl mb-2">Solicitação enviada!</h2>
            <p className="text-white/60 text-sm mb-6">
              {pro?.name} foi notificado e responderá em breve. Acompanhe pelo chat ou status do serviço.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate('/acompanhamento')} className="bg-[#FFD100] text-[#0A1628] font-bold py-3.5 rounded-2xl hover:bg-[#FFDE33] transition-colors">
                Acompanhar serviço
              </button>
              <button onClick={() => navigate('/')} className="text-white/60 hover:text-white text-sm transition-colors">
                Voltar ao início
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A1628] pt-16 pb-8">
        {/* Header */}
        <div className="bg-[#0D1F3C] border-b border-white/10 py-3 px-4 sticky top-16 z-40">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <ChevronLeft size={20} className="text-white" />
            </button>
            <span className="text-white font-semibold">Solicitar orçamento</span>
          </div>
        </div>

        <div ref={formRef} className="max-w-2xl mx-auto px-4 py-6 space-y-5">
          {/* Professional summary */}
          {pro && (
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
                style={{ backgroundColor: pro.color }}
              >
                {pro.initials}
              </div>
              <div>
                <p className="text-[#1A2A4A] font-bold">{pro.name}</p>
                <p className="text-gray-500 text-sm">{pro.profession} · {pro.distance}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[#1A2A4A] font-bold text-sm">{pro.price}</p>
              </div>
            </div>
          )}

          {/* Service description */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-[#1A2A4A] font-bold mb-3">Descreva o serviço</h2>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ex: Preciso instalar 3 tomadas novas na cozinha e trocar o disjuntor principal..."
              className="w-full h-28 p-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1A2A4A] text-sm resize-none focus:outline-none focus:border-[#FFD100] transition-colors"
            />
            <button className="flex items-center gap-2 text-gray-400 text-sm mt-3 hover:text-gray-600 transition-colors">
              <Camera size={16} /> Adicionar fotos (opcional)
            </button>
          </div>

          {/* Urgency */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-[#1A2A4A] font-bold mb-3">Quando você precisa?</h2>
            <div className="grid grid-cols-2 gap-2">
              {urgencyOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setUrgency(opt.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    urgency === opt.id
                      ? 'border-[#FFD100] bg-[#FFD100]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`font-semibold text-sm ${urgency === opt.id ? 'text-[#0A1628]' : 'text-[#1A2A4A]'}`}>{opt.label}</p>
                  <p className="text-gray-400 text-xs">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-[#1A2A4A] font-bold mb-3">Endereço do serviço</h2>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#1A2A4A]">
              {location}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#FFD100] text-[#0A1628] font-bold py-4 rounded-2xl hover:bg-[#FFDE33] transition-colors text-base shadow-lg"
          >
            Confirmar solicitação
          </button>
          <p className="flex items-center justify-center gap-1.5 text-center text-white/40 text-xs">
            <ShieldCheck size={13} className="text-[#FFD100]" /> Profissionais verificados passam por análise da plataforma.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
