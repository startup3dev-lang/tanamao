import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';
import gsap from 'gsap';
import { professionals, categories } from '../data/mockData';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { PageTransition } from '../components/PageTransition';
import { useApp } from '../context/AppContext';
import { CategoryIcon, BadgeIcon } from '../components/AppIcons';

const filters = [
  { id: 'proximos', label: 'Mais próximos' },
  { id: 'avaliados', label: 'Melhor avaliados' },
  { id: 'disponiveis', label: 'Disponíveis agora' },
  { id: 'desconto', label: 'Com desconto' },
  { id: 'preco', label: 'Menor preço' },
  { id: 'verificados', label: 'Verificados' },
];

export function Professionals() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('categoria') || '';
  const initialSearch = searchParams.get('busca') || '';
  const [search, setSearch] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState('proximos');
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const { location, setShowLocationModal } = useApp();
  const cardsRef = useRef<HTMLDivElement>(null);

  const filtered = professionals.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.profession.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCat || p.category === selectedCat;
    const matchFilter = activeFilter === 'disponiveis' ? p.available : activeFilter === 'desconto' ? !!p.discount : activeFilter === 'verificados' ? p.verified : true;
    return matchSearch && matchCat && matchFilter;
  });

  useEffect(() => {
    if (!cardsRef.current) return;
    gsap.fromTo(cardsRef.current.querySelectorAll('.pro-list-card'),
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
  }, [activeFilter, selectedCat, search]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A1628] pt-16 pb-24">
        {/* Sticky top bar */}
        <div className="sticky top-16 z-40 bg-[#0D1F3C] border-b border-white/10 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-3">
            {/* Location */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-1.5 text-white/60 text-xs mb-2 hover:text-white transition-colors"
            >
              <MapPin size={12} className="text-[#FFD100]" />
              <span>Profissionais em: <span className="text-white font-medium">{location}</span></span>
              <span className="text-[#FFD100] underline">Alterar</span>
            </button>

            {/* Search bar */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2">
                <Search size={15} className="text-white/40 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Qual serviço você precisa?"
                  className="flex-1 bg-transparent text-white text-sm placeholder-white/40 outline-none"
                />
                {search && (
                  <button onClick={() => setSearch('')}><X size={14} className="text-white/40" /></button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-none">
              {filters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
                    activeFilter === f.id
                      ? 'bg-[#FFD100] text-[#0A1628]'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Category pills */}
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCat('')}
                className={`shrink-0 text-xs px-3 py-1 rounded-full transition-colors ${!selectedCat ? 'bg-white text-[#0A1628] font-bold' : 'bg-white/10 text-white/60'}`}
              >
                Todos
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCat(selectedCat === c.name ? '' : c.name)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors ${selectedCat === c.name ? 'bg-white text-[#0A1628] font-bold' : 'bg-white/10 text-white/60'}`}
                >
                  <CategoryIcon name={c.icon} size={13} className="text-current" /> {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/50 text-sm">
              <span className="text-white font-semibold">{filtered.length}</span> profissionais encontrados
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <BadgeIcon type="tag" />
              </div>
              <p className="text-white/60 text-lg font-medium">Nenhum profissional encontrado</p>
              <p className="text-white/40 text-sm mt-2">Tente ajustar os filtros ou buscar por outro serviço.</p>
            </div>
          ) : (
            <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((pro, i) => (
                <div key={pro.id} className="pro-list-card" style={{ opacity: 0 }}>
                  <ProfessionalCard pro={pro} featured={i === 0 && activeFilter === 'proximos'} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
