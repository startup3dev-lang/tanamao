import { motion } from 'motion/react';
import { LogoMark } from './AppIcons';

export function LoadingScreen() {
  return (
    <div className="min-h-[70vh] px-4 pt-28" role="status" aria-live="polite" aria-label="Carregando conteúdo">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-center gap-3">
          <motion.div animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
            <LogoMark />
          </motion.div>
          <span className="text-sm font-semibold text-black/50">Preparando tudo para você…</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map(index => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="overflow-hidden rounded-[22px] border border-black/[0.06] bg-white p-5 shadow-sm">
              <div className="mb-5 h-14 w-14 animate-pulse rounded-2xl bg-black/[0.06]" />
              <div className="mb-3 h-4 w-2/3 animate-pulse rounded-full bg-black/[0.07]" />
              <div className="h-3 w-1/2 animate-pulse rounded-full bg-black/[0.05]" />
            </motion.div>
          ))}
        </div>
      </div>
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
