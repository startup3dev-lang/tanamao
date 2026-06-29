import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Star, ChevronLeft, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { ratingTags } from '../data/mockData';
import { PageTransition } from '../components/PageTransition';
import { useApp } from '../context/AppContext';

export function Rating() {
  const navigate = useNavigate();
  const { selectedProfessional } = useApp();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const starsRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const pro = selectedProfessional;

  useEffect(() => {
    gsap.fromTo(starsRef.current?.querySelectorAll('.star-btn') ?? [],
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(2)' , delay: 0.3 }
    );
  }, []);

  const handleSetRating = (val: number) => {
    setRating(val);
    gsap.fromTo(starsRef.current?.querySelectorAll('.star-btn') ?? [],
      { scale: 0.85 },
      { scale: 1, duration: 0.3, stagger: 0.04, ease: 'back.out(2)' }
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = () => {
    if (!rating) return;
    gsap.to('.rating-form', { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in', onComplete: () => {
      setSubmitted(true);
      setTimeout(() => {
        gsap.fromTo(successRef.current,
          { opacity: 0, scale: 0.8 },
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
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#FFD100]">
              <CheckCircle size={38} className="text-[#071327]" />
            </div>
            <h2 className="text-white font-black text-2xl mb-2">Obrigado pela avaliação!</h2>
            <p className="text-white/60 text-sm mb-6">Sua avaliação ajuda outros clientes a encontrar os melhores profissionais.</p>
            <button onClick={() => navigate('/')} className="bg-[#FFD100] text-[#0A1628] font-bold px-8 py-3.5 rounded-2xl hover:bg-[#FFDE33] transition-colors">
              Voltar ao início
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A1628] pt-16 pb-8">
        <div className="bg-[#0D1F3C] border-b border-white/10 py-3 px-4 sticky top-16 z-40">
          <div className="max-w-xl mx-auto flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <ChevronLeft size={20} className="text-white" />
            </button>
            <span className="text-white font-semibold">Avaliar profissional</span>
          </div>
        </div>

        <div className="rating-form max-w-xl mx-auto px-4 py-6 space-y-5">
          {/* Professional */}
          {pro && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3" style={{ backgroundColor: pro.color }}>
                {pro.initials}
              </div>
              <h2 className="text-white font-black text-xl">{pro.name}</h2>
              <p className="text-white/50 text-sm">{pro.profession}</p>
            </div>
          )}

          {/* Stars */}
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="text-[#1A2A4A] font-bold text-base mb-4">Como foi o serviço?</p>
            <div ref={starsRef} className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  className="star-btn p-1 transition-transform"
                  onMouseEnter={() => setHovered(val)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => handleSetRating(val)}
                  style={{ opacity: 0 }}
                >
                  <Star
                    size={36}
                    className="transition-colors duration-150"
                    style={{ color: val <= (hovered || rating) ? '#FFD100' : '#E5E7EB' }}
                    fill={val <= (hovered || rating) ? '#FFD100' : '#E5E7EB'}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-gray-500 text-sm mt-3">
                {['', 'Ruim', 'Regular', 'Bom', 'Ótimo', 'Excelente!'][rating]}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-[#1A2A4A] font-bold text-base mb-3">O que você destacaria?</p>
            <div className="flex flex-wrap gap-2">
              {ratingTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-[#FFD100] border-[#FFD100] text-[#0A1628]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-[#1A2A4A] font-bold text-base mb-3">Deixe um comentário</p>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Conte como foi a experiência com o profissional..."
              className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1A2A4A] text-sm resize-none focus:outline-none focus:border-[#FFD100] transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!rating}
            className="w-full bg-[#FFD100] text-[#0A1628] font-bold py-4 rounded-2xl hover:bg-[#FFDE33] transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-base"
          >
            Enviar avaliação
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
