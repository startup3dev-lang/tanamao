import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { categories } from '../data/mockData';
import { PageTransition } from '../components/PageTransition';
import { CategoryIcon } from '../components/AppIcons';

export function Categories() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      '.cat-grid-card',
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out', delay: 0.15 }
    );
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#071327] pt-20 pb-24">
        <div className="border-b border-white/10 bg-[#0C1B33] px-4 py-8">
          <div className="mx-auto max-w-5xl">
            <h1 className="mb-1 text-2xl font-black text-white">Categorias de serviços</h1>
            <p className="text-sm text-white/55">Escolha a categoria para encontrar profissionais disponíveis próximos a você.</p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8">
          <div ref={gridRef} className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {categories.map(cat => (
              <div key={cat.id} className="cat-grid-card" style={{ opacity: 0 }}>
                <div className="group cursor-pointer rounded-2xl border border-white/12 bg-white/[0.07] p-5 shadow-xl shadow-black/10 transition-all duration-300 hover:border-[#FFD100]/50 hover:bg-white/[0.10]">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD100]/10">
                    <CategoryIcon name={cat.icon} size={30} />
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{cat.name}</h3>
                      <p className="mt-0.5 text-sm text-white/45">{cat.count} profissionais</p>
                    </div>
                    {cat.popular && <span className="shrink-0 rounded-full bg-[#FFD100] px-1.5 py-0.5 text-[9px] font-bold text-[#071327]">POPULAR</span>}
                  </div>
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#FFD100]">
                      Ver profissionais <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
