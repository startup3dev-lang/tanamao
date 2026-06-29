import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Zap, MapPin, Clock, Star, TrendingUp, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { categories } from '../data/mockData';
import { PageTransition } from '../components/PageTransition';
import { CategoryIcon } from '../components/AppIcons';

const steps = ['Dados pessoais', 'Serviços', 'Disponibilidade', 'Confirmação'];

export function ProfessionalRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', phone: '', city: '', profession: '', experience: '', price: '',
  });
  const formRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (step < steps.length - 1) {
      gsap.to(formRef.current, { opacity: 0, x: -30, duration: 0.25, ease: 'power2.in', onComplete: () => {
        setStep(s => s + 1);
        gsap.fromTo(formRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' });
      }});
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A1628] pt-16 pb-8">
        {/* Header */}
        <div className="bg-[#FFD100] py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[#0A1628]/60 text-sm mb-4 hover:text-[#0A1628] transition-colors">
              <ChevronLeft size={16} /> Voltar
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#0A1628] rounded-2xl flex items-center justify-center">
                <Zap size={22} className="text-[#FFD100]" fill="#FFD100" />
              </div>
              <div>
                <h1 className="text-[#0A1628] font-black text-xl">Seja um profissional</h1>
                <p className="text-[#0A1628]/70 text-sm">Ganhe dinheiro oferecendo seus serviços no TA PRONTO</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <MapPin size={14} />, text: 'Receba pedidos próximos' },
                { icon: <Clock size={14} />, text: 'Defina sua agenda' },
                { icon: <TrendingUp size={14} />, text: 'Mais visibilidade' },
                { icon: <Star size={14} />, text: 'Avaliações dos clientes' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-[#0A1628]/10 px-3 py-2 rounded-xl">
                  <span className="text-[#0A1628]">{b.icon}</span>
                  <span className="text-[#0A1628] text-xs font-semibold">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            {steps.map((s, i) => (
              <div key={i} className="flex-1">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-[#FFD100]' : 'bg-white/20'}`} />
                <p className={`text-xs mt-1 font-medium ${i === step ? 'text-[#FFD100]' : 'text-white/30'}`}>{s}</p>
              </div>
            ))}
          </div>

          <div ref={formRef}>
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-white font-bold text-lg">Dados pessoais</h2>
                {[
                  { label: 'Nome completo', key: 'name', placeholder: 'Seu nome completo' },
                  { label: 'Telefone', key: 'phone', placeholder: '(11) 99999-9999' },
                  { label: 'Cidade', key: 'city', placeholder: 'Sua cidade' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-white/60 text-sm font-medium block mb-1">{field.label}</label>
                    <input
                      type="text"
                      value={form[field.key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FFD100] transition-colors"
                    />
                  </div>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-white font-bold text-lg">Seus serviços</h2>
                <div>
                  <label className="text-white/60 text-sm font-medium block mb-2">Profissão principal</label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setForm(f => ({ ...f, profession: cat.name }))}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                          form.profession === cat.name
                            ? 'border-[#FFD100] bg-[#FFD100]/10 text-white'
                            : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                        }`}
                      >
                        <CategoryIcon name={cat.icon} size={18} className={form.profession === cat.name ? 'text-[#FFD100]' : 'text-white/55'} />
                        <span className="text-sm font-medium">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-white/60 text-sm font-medium block mb-1">Preço inicial</label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="Ex: R$ 80"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FFD100] transition-colors"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-white font-bold text-lg">Disponibilidade</h2>
                <p className="text-white/50 text-sm">Escolha os dias em que você estará disponível para atender.</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
                    <button
                      key={day}
                      className="p-3 rounded-xl border-2 border-white/20 bg-white/5 text-white/70 text-sm font-medium hover:border-[#FFD100] hover:text-white transition-colors"
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-white/60 text-sm font-medium block mb-2">Experiência</label>
                  <textarea
                    value={form.experience}
                    onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                    placeholder="Conte sobre sua experiência profissional..."
                    className="w-full h-24 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:border-[#FFD100] transition-colors"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 bg-[#FFD100] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={36} className="text-[#0A1628]" />
                </div>
                <h2 className="text-white font-black text-2xl">Quase lá!</h2>
                <p className="text-white/60 text-sm max-w-xs mx-auto">
                  Seu cadastro foi recebido. Nossa equipe irá analisar seu perfil e você será notificado em até 24 horas.
                </p>
                <div className="bg-[#0D1F3C] rounded-2xl p-4 text-left border border-white/10">
                  <p className="text-white font-semibold">{form.name || 'Profissional'}</p>
                  <p className="text-white/50 text-sm">{form.profession || 'Serviços gerais'} · {form.city || 'São Paulo'}</p>
                  <p className="text-[#FFD100] text-sm font-semibold mt-1">{form.price || 'A partir de R$ 80'}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            {step < steps.length - 1 ? (
              <button onClick={handleNext} className="w-full bg-[#FFD100] text-[#0A1628] font-bold py-4 rounded-2xl hover:bg-[#FFDE33] transition-colors">
                {step === steps.length - 2 ? 'Finalizar cadastro' : 'Continuar'}
              </button>
            ) : (
              <button onClick={() => navigate('/')} className="w-full bg-[#FFD100] text-[#0A1628] font-bold py-4 rounded-2xl hover:bg-[#FFDE33] transition-colors">
                Ir para o início
              </button>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
