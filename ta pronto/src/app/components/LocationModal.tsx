import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, X, Clock } from 'lucide-react';
import gsap from 'gsap';
import { useApp } from '../context/AppContext';

const recentLocations = [
  'Rua das Flores, 123 – Vila Mariana, SP',
  'Av. Paulista, 1000 – Bela Vista, SP',
  'Rua Augusta, 500 – Consolação, SP',
];

export function LocationModal() {
  const { showLocationModal, setShowLocationModal, setLocation } = useApp();
  const [input, setInput] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showLocationModal) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(modalRef.current,
        { opacity: 0, y: 60, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.4)' }
      );
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showLocationModal]);

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 });
    gsap.to(modalRef.current, { opacity: 0, y: 40, scale: 0.96, duration: 0.25, ease: 'power2.in', onComplete: () => setShowLocationModal(false) });
  };

  const handleConfirm = (loc?: string) => {
    const val = loc || input;
    if (val.trim()) {
      setLocation(val.trim());
      handleClose();
    }
  };

  const handleUseMyLocation = () => {
    setLocation('Sua localização atual');
    handleClose();
  };

  if (!showLocationModal) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div ref={modalRef} className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-[#FFD100]" />
            <h2 className="text-[#1A2A4A] font-bold text-lg">Sua localização</h2>
          </div>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Search input */}
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleConfirm()}
              placeholder="Digite seu endereço, bairro ou cidade"
              className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1A2A4A] text-sm focus:outline-none focus:border-[#FFD100] transition-colors"
              autoFocus
            />
          </div>

          {/* Use my location */}
          <button
            onClick={handleUseMyLocation}
            className="flex items-center gap-3 w-full p-3 rounded-xl border border-[#FFD100]/30 bg-[#FFD100]/5 hover:bg-[#FFD100]/10 transition-colors"
          >
            <div className="w-8 h-8 bg-[#FFD100] rounded-full flex items-center justify-center shrink-0">
              <Navigation size={14} className="text-[#0A1628]" />
            </div>
            <div className="text-left">
              <p className="text-[#1A2A4A] font-semibold text-sm">Usar minha localização atual</p>
              <p className="text-gray-400 text-xs">Detectar automaticamente</p>
            </div>
          </button>

          {/* Recent locations */}
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Recentes</p>
            {recentLocations.map((loc, i) => (
              <button
                key={i}
                onClick={() => handleConfirm(loc)}
                className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <Clock size={14} className="text-gray-400 shrink-0" />
                <span className="text-[#1A2A4A] text-sm">{loc}</span>
              </button>
            ))}
          </div>

          <p className="text-gray-400 text-xs text-center">
            Usamos sua localização apenas para encontrar profissionais próximos.
          </p>

          <button
            onClick={() => handleConfirm()}
            className="w-full bg-[#FFD100] text-[#0A1628] font-bold py-3 rounded-xl hover:bg-[#FFDE33] transition-colors"
          >
            Confirmar localização
          </button>
        </div>
      </div>
    </div>
  );
}
